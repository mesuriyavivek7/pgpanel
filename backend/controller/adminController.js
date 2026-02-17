import TRANSACTION from "../models/TRANSACTION.js";
import BANKACCOUNT from "../models/BANKACCOUNT.js";
import BRANCH from "../models/BRANCH.js";
import CUSTOMER from "../models/CUSTOMER.js";
import EMPLOYEE from "../models/EMPLOYEE.js";
import ACCOUNT from "../models/ACCOUNT.js";
import { getMonthShortNames } from "../helper.js";
import { removeFile } from "../utils/removeFile.js";
import ADMIN from "../models/ADMIN.js";
import LOGINMAPPING from "../models/LOGINMAPPING.js";
import bcryptjs from "bcryptjs";
import ROOM from "../models/ROOM.js";
import CUSTOMERRENT from "../models/CUSTOMERRENT.js";
import RESETACCOUNT from "../models/RESETACCOUNT.js";
import { buildResetMap } from "../helper.js";

export const getDashboardSummery = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    /* ---------- BASIC COUNTS ---------- */
    const [
      totalEmployees,
      totalCustomers,
      totalBranch,
      totalAcManagers,
      totalPendingRents,
      resets
    ] = await Promise.all([
      EMPLOYEE.countDocuments({ status: 'Active' }),
      CUSTOMER.countDocuments({ status: 'Active' }),
      BRANCH.countDocuments(),
      LOGINMAPPING.countDocuments({ status: true, userType: "Account" }),
      CUSTOMERRENT.aggregate([
        {$match:{status:"Pending"}} ,
        {
          $lookup:{
            from:"customers",
            localField:"customer",
            foreignField:"_id",
            as:"customerData"
          }
        },
        {$unwind:"$customerData"},
        {$match:{"customerData.status":"Active"}},
        {$group:{_id:"$customer"}},
        {$count:"Total"}
      ]),
      RESETACCOUNT.find()
    ]);

    /* ---------- VACANT SEATS ---------- */
    const vacantSeatsAgg = await ROOM.aggregate([
      {
        $group: {
          _id: null,
          totalVacant: { $sum: { $subtract: ["$capacity", "$filled"] } }
        }
      }
    ]);
    const vacantSeats = vacantSeatsAgg.length ? vacantSeatsAgg[0].totalVacant : 0;

    /* ---------- RESET MAP ---------- */
    const resetMap = buildResetMap(resets);

    /* ---------- ALL TRANSACTIONS (NO RESET FILTER) ---------- */
    const allTransactions = await TRANSACTION.find({
      transactionType: { $in: ["income", "expense"] }
    })
      .populate("refId")
      .populate("bank_account")
      .populate("branch");

    /* ---------- DEPOSIT / WITHDRAW ---------- */
    const depositeTransactions = await TRANSACTION.find({
      transactionType: { $in: ["deposite", "withdrawal"] }
    }).populate("refId");

    /* ---------- RESET FILTERED TRANSACTIONS (ONLY FOR BANK) ---------- */
    const resetFilteredTransactions = allTransactions.filter(tx => {
      if (!tx.bank_account) return true;
      const resetDate = resetMap[tx.bank_account._id.toString()];
      if (!resetDate) return true;
      return new Date(tx.createdAt) > resetDate;
    });

    /* ---------- DEPOSIT TOTAL ---------- */
    let totalDepositeAmount = 0;
    depositeTransactions.forEach(tx => {
      if (!tx.refId?.amount) return;
      totalDepositeAmount +=
        tx.transactionType === "deposite"
          ? tx.refId.amount
          : -tx.refId.amount;
    });

    /* ---------- MONTHLY INIT ---------- */
    let monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: getMonthShortNames(i + 1),
      Profit: 0,
      Expenditure: 0
    }));

    let yearlyMap = {};
    let branchMap = {};

    let totalMonthlyProfit = 0;
    let totalMonthlyExpenditure = 0;
    let totalCurrentYearProfit = 0;
    let totalCurrentYearExpenditure = 0;

    /* ---------- PROCESS ALL TRANSACTIONS (NO RESET) ---------- */
    allTransactions.forEach(tx => {
      if (!tx.refId?.amount) return;

      const amount = tx.refId.amount;
      const createdAt = new Date(tx.createdAt);
      const month = createdAt.getMonth() + 1;
      const year = createdAt.getFullYear();
      const branchId = tx.branch?._id?.toString();

      /* ---------- GLOBAL TOTALS ---------- */
      if (year === currentYear) {
        if (tx.transactionType === "income") {
          totalCurrentYearProfit += amount;
          if (month === currentMonth) totalMonthlyProfit += amount;
        } else {
          totalCurrentYearExpenditure += amount;
          if (month === currentMonth) totalMonthlyExpenditure += amount;
        }
      }

      /* ---------- MONTHLY CHART ---------- */
      if (tx.transactionType === "income") {
        monthlyData[month - 1].Profit += amount;
      } else {
        monthlyData[month - 1].Expenditure += amount;
      }

      /* ---------- YEARLY CHART ---------- */
      if (!yearlyMap[year]) {
        yearlyMap[year] = { year, Profit: 0, Expenditure: 0 };
      }
      tx.transactionType === "income"
        ? (yearlyMap[year].Profit += amount)
        : (yearlyMap[year].Expenditure += amount);

      /* ---------- BRANCH-WISE ---------- */
      if (branchId) {
        if (!branchMap[branchId]) {
          branchMap[branchId] = {
            branchId,
            branch_name: tx.branch.branch_name,
            totalMonthlyProfit: 0,
            totalMonthlyExpenditure: 0,
            totalCurrentYearProfit: 0,
            totalCurrentYearExpenditure: 0
          };
        }

        if (year === currentYear) {
          if (tx.transactionType === "income") {
            branchMap[branchId].totalCurrentYearProfit += amount;
            if (month === currentMonth)
              branchMap[branchId].totalMonthlyProfit += amount;
          } else {
            branchMap[branchId].totalCurrentYearExpenditure += amount;
            if (month === currentMonth)
              branchMap[branchId].totalMonthlyExpenditure += amount;
          }
        }
      }
    });

    /* ---------- YEARLY DATA (LAST 5 YEARS) ---------- */
    const yearlyData = [];
    for (let y = currentYear; y > currentYear - 5; y--) {
      yearlyData.push({
        year: y,
        Profit: yearlyMap[y]?.Profit || 0,
        Expenditure: yearlyMap[y]?.Expenditure || 0
      });
    }

    /* ---------- BANK ACCOUNTS (RESET APPLIED) ---------- */
    const accounts = await BANKACCOUNT.find({ status: "active" });

    const accountsData = accounts.map(acc => {
      const accTx = resetFilteredTransactions.filter(
        t => t.bank_account?._id.toString() === acc._id.toString()
      );

      let balance = 0;
      accTx.forEach(tx => {
        if (!tx.refId?.amount) return;
        balance += tx.transactionType === "income"
          ? tx.refId.amount
          : -tx.refId.amount;
      });

      return {
        account_holdername: acc.account_holdername,
        current_balance: balance
      };
    });

    const current_balance = accountsData.reduce((acc, val) => acc + val.current_balance, 0);

    const pendingRents = totalPendingRents.length ? totalPendingRents[0].Total : 0;

    /* ---------- RESPONSE ---------- */
    return res.status(200).json({
      success: true,
      message: "Dashboard summary retrieved successfully.",
      data: {
        monthlyData,
        yearlyData,
        current_balance,
        total_monthly_profit: totalMonthlyProfit,
        total_monthly_expenditure: totalMonthlyExpenditure,
        total_current_year_profit: totalCurrentYearProfit,
        total_current_year_expenditure: totalCurrentYearExpenditure,
        accounts: accountsData,
        totalBranch,
        totalCustomers,
        totalEmployees,
        totalAcManagers,
        vacantSeats,
        pendingRents,
        branchWiseData: Object.values(branchMap),
        totalDepositeAmount
      }
    });
  } catch (err) {
    next(err);
  }
};



export const getDashboardSearch = async (req, res, next) => {
  try {
    const { searchQuery } = req.query;

    const { role } = req.params;
    let results = [];

    if (!searchQuery)
      return res
        .status(200)
        .json({
          message: "Provide searchquery to get data.",
          data: [],
          success: true,
        });

    switch (role) {
      case "Customers":
        {
          results = await CUSTOMER.find({
            $or: [
              { customer_name: { $regex: searchQuery, $options: "i" } },
              { mobile_no: { $regex: searchQuery, $options: "i" } },
            ],
            status: true,
          })
            .populate("room")
            .populate("branch");
        }
        break;

      case "Employees":
        {
          results = await EMPLOYEE.find({
            $or: [
              { employee_name: { $regex: searchQuery, $options: "i" } },
              { mobile_no: { $regex: searchQuery, $options: "i" } },
            ],
            status: true,
          }).populate("branch");
        }
        break;

      case "Ac Managers":
        {
          results = await ACCOUNT.find({
            $or: [
              { full_name: { $regex: searchQuery, $options: "i" } },
              { contact_no: { $regex: searchQuery, $options: "i" } },
              { email: { $regex: searchQuery, $options: "i" } },
            ],
          }).populate("branch");
        }
        break;

      default: {
        return res
          .status(400)
          .json({ data: null, message: "Invalid role.", success: false });
      }
    }

    return res
      .status(200)
      .json({
        message: "All search query results retrived successfully.",
        data: results,
        success: true,
      });
  } catch (err) {
    next(err);
  }
};

export const getAdminDetails = async (req, res, next) => {
  try {
    const { mongoid } = req;

    const admin = await ADMIN.findById(mongoid);

    return res
      .status(200)
      .json({
        message: "Admin details retrival successfully.",
        data: admin,
        success: true,
      });
  } catch (err) {
    next(err);
  }
};

export const uploadLogo = async (req, res, next) => {
  try {
    const { mongoid } = req;

    const admin = await ADMIN.findById(mongoid);

    if (!admin) {
      await removeFile(path.join("uploads", "branch", req.file.filename));
      return res
        .status(404)
        .json({ message: "Admin not found.", success: false });
    }

    if (admin.pglogo) {
      const filePath = admin.pglogo.replace(process.env.DOMAIN, "");
      await removeFile(filePath);
    }

    let imageUrl = null;

    imageUrl = `${process.env.DOMAIN}/uploads/logo/${req.file.filename}`;

    admin.pglogo = imageUrl;

    await admin.save();

    return res
      .status(200)
      .json({ message: "Logo uploaded successfully.", success: true });
  } catch (err) {
    next(err);
  }
};

export const updateAdminDetails = async (req, res, next) => {
  try {
    const { mongoid } = req;

    const admin = await ADMIN.findById(mongoid);

    if (!admin)
      return res
        .status(404)
        .json({ message: "Admin not found.", success: false });

    const { full_name, email } = req.body;

    if (email && admin.email !== email) {
      const existUser = await LOGINMAPPING.findOne({ email });

      if (existUser)
        return res
          .status(409)
          .json({
            message: "User is already exist with same email address.",
            success: false,
          });
    }

    await LOGINMAPPING.findOneAndUpdate(
      { mongoid },
      { $set: { email: email } }
    );

    admin.full_name = full_name;
    admin.email = email;

    await admin.save();

    return res
      .status(200)
      .json({ message: "Admin details updated successfully.", success: true });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { mongoid } = req;

    const { password, current_password } = req.body;

    if (!password || !current_password)
      return res
        .status(400)
        .json({
          message: "Please provide all required fields.",
          success: false,
        });

    const loginmapping = await LOGINMAPPING.findOne({ mongoid });

    if (!loginmapping)
      return res
        .status(404)
        .json({ message: "Admin not found.", success: false });

    const isMatch = await bcryptjs.compare(
      current_password,
      loginmapping.password
    );
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Current password is incorrect.", success: false });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    loginmapping.password = hashedPassword;
    await loginmapping.save();

    return res
      .status(200)
      .json({ message: "Password changed successfully.", success: true });
  } catch (err) {
    next(err);
  }
};
