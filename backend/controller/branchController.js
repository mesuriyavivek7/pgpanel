import BRANCH from "../models/BRANCH.js";
import dotenv from "dotenv";
import path from "path";
import { removeFile } from "../utils/removeFile.js";
import ROOM from "../models/ROOM.js";
import CUSTOMER from "../models/CUSTOMER.js";
import EMPLOYEE from "../models/EMPLOYEE.js";
import ACCOUNT from "../models/ACCOUNT.js";
import LOGINMAPPING from "../models/LOGINMAPPING.js";

dotenv.config();

export const createBranch = async (req, res, next) => {
  try {
    const { mongoid } = req;
    const { branch_name, branch_address } = req.body;
    if (!branch_name || !branch_address) {
      if (req.file) {
        await removeFile(path.join("uploads", "branch", req.file.filename));
      }
      return res
        .status(400)
        .json({ message: "Please provide required fields.", success: false });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `${process.env.DOMAIN}/uploads/branch/${req.file.filename}`;
    }

    const newBranch = new BRANCH({
      branch_name,
      branch_address,
      branch_image: imageUrl,
      added_by: mongoid,
    });

    await newBranch.save();

    return res
      .status(201)
      .json({ message: "New branch created successfully", success: true });
  } catch (err) {
    if (req.file) {
      await removeFile(path.join("uploads", "branch", req.file.filename));
    }
    next(err);
  }
};

export const getAllBranch = async (req, res, next) => {
  try {
    const { searchQuery } = req.query;
    let branch = [];
    if (searchQuery) {
      branch = await BRANCH.find({
        branch_name: { $regex: searchQuery, $options: "i" },
      }).sort({ createdAt: -1 });
    } else {
      branch = await BRANCH.find().sort({ createdAt: -1 });
    }

    return res
      .status(200)
      .json({
        message: "All Branches retrived successfully.",
        success: true,
        data: branch,
      });
  } catch (err) {
    next(err);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
    const { branchId } = req.params;

    const { branch_name, branch_address, remove_image } = req.body;

    const uploadedFile = req.file;

    if (!branchId)
      return res
        .status(400)
        .json({ message: "Please provide branch id.", success: false });

    const branch = await BRANCH.findById(branchId);

    if (!branch)
      return res
        .status(404)
        .json({ message: "Branch not found.", success: false });

    if (uploadedFile) {
      if (branch.branch_image) {
        const arr = branch.branch_image.split("/");
        const fileName = arr[arr.length - 1];

        removeFile(path.join("uploads", "branch", fileName));
      }

      branch.branch_image = `${process.env.DOMAIN}/uploads/branch/${uploadedFile.filename}`;
    }

    if (remove_image && branch.branch_image) {
      const arr = branch.branch_image.split("/");
      const fileName = arr[arr.length - 1];
      removeFile(path.join("uploads", "branch", fileName));
      branch.branch_image = null;
    }

    if (branch_name) {
      branch.branch_name = branch_name;
    }

    if (branch_address) {
      branch.branch_address = branch_address;
    }

    await branch.save();

    return res
      .status(200)
      .json({ message: "Branch saved successfully.", success: true });
  } catch (err) {
    next(err);
  }
};

export const getBranchById = async (req, res, next) => {
  try {
    const { branchId } = req.params;

    if (!branchId)
      return res
        .status(400)
        .json({ message: "Please provide branch id.", success: false });

    const branch = await BRANCH.findById(branchId);

    if (!branch)
      return res
        .status(200)
        .json({ message: "Branch not found.", success: false });

    return res
      .status(200)
      .json({
        message: "Branch details retrived successfully.",
        success: true,
        data: branch,
      });
  } catch (err) {
    next(err);
  }
};

export const getDashboardSummery = async (req, res, next) => {
  try {
    const { branchId } = req.params;

    if (!branchId)
      return res
        .status(400)
        .json({ message: "Please provide branch id.", success: false });

    const totalRooms = await ROOM.find({ branch: branchId }).countDocuments();
    const totalCustomers = await CUSTOMER.find({
      branch: branchId,
      status: true,
    }).countDocuments();
    const totalEmployees = await EMPLOYEE.find({
      branch: branchId,
      status: true,
    }).countDocuments();

    return res.status(200).json({
      message: "Dashboard summery retrived for branch.",
      data: {
        totalRooms,
        totalCustomers,
        totalEmployees,
      },
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllBranchByManger = async (req, res, next) => {
  try {
    const { mongoid } = req
    const { searchQuery } = req.query;

    const loginUser = await LOGINMAPPING.findOne({mongoid, status: true})

    if(!loginUser){
      return res.status(403).json({message: "You are not authorized to access this data.", success: false})
    }

    let branches = []
    const account = await ACCOUNT.findOne({ _id: mongoid })

    if (!account) {
      return res.status(404).json({ message: "Account manager not found.", success: false })
    }

    const branchIds = account.branch 

    let filter = { _id: { $in: branchIds } }
    if (searchQuery) {
      filter.branch_name = { $regex: searchQuery, $options: "i" }
    }

    branches = await BRANCH.find(filter).sort({ createdAt: -1 })

    return res.status(200).json({ message: "All brach by manager retrived successfully.", success: true, data: branches })

  } catch (error) {
    next(error)
  }
}