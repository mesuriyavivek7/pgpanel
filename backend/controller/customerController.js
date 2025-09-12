import BRANCH from "../models/BRANCH.js";
import CUSTOMER from "../models/CUSTOMER.js";
import ROOM from "../models/ROOM.js";
import TRANSACTION from "../models/TRANSACTION.js";
import { getMonthYearList, getPendingMonths } from "../helper.js";
import LOGINMAPPING from "../models/LOGINMAPPING.js";
import ACCOUNT from "../models/ACCOUNT.js";

export const createCustomer = async (req, res, next) => {
    try {
        const { mongoid, userType } = req
        const { customer_name, mobile_no, deposite_amount, rent_amount, room, branch, joining_date } = req.body

        if (!customer_name || !mobile_no || !deposite_amount || !rent_amount || !room || !branch || !joining_date) return res.status(400).json({ message: "Please provide all required fields.", success: false })

        const existCustomer = await CUSTOMER.findOne({ mobile_no })

        if (existCustomer) return res.status(409).json({ message: "Customer is already exist same mobile no.", success: false })

        const existRoom = await ROOM.findById(room)

        if (!existRoom) return res.status(404).json({ message: "Room not found.", success: false })

        const existBranch = await BRANCH.findById(branch)

        if (!existBranch) return res.status(404).json({ message: "Branch is not found", success: false })

        if (existRoom.filled >= existRoom.capacity) return res.status(400).json({ message: "Room is already full. Cannot add more customers.", success: false })

        const newCustomer = await CUSTOMER({
            customer_name,
            mobile_no,
            deposite_amount,
            rent_amount,
            room,
            joining_date,
            branch,
            added_by: mongoid,
            added_by_type: userType
        })

        existRoom.filled = existRoom.filled + 1

        await existRoom.save()
        await newCustomer.save()

        return res.status(200).json({ message: "New customer created successfully.", success: true, data: newCustomer })

    } catch (err) {
        next(err)
    }
}

export const getAllCustomer = async (req, res, next) => {
    try {
        const { searchQuery, branch, room } = req.query;

        const filter = {};

        if (searchQuery) {
            filter.customer_name = { $regex: searchQuery, $options: 'i' };
        }

        if (branch) {
            filter.branch = branch;
        }

        if (room) {
            filter.room = room
        }

        const customers = await CUSTOMER.find(filter)
            .populate('room')
            .populate('branch')
            .populate('added_by')
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "All customer details retrived.", data: customers, success: true });
    } catch (err) {
        next(err);
    }
};

export const getCustomerByRoomId = async (req, res, next) => {
    try {
        const { roomId } = req.params
        if (!roomId) return res.status(400).json({ message: "Please provide room id.", success: false })
        const { searchQuery } = req.query

        const filter = {}

        if (searchQuery) filter.customer_name = searchQuery
        filter.room = roomId

        const customers = await CUSTOMER.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ message: "All customer details retrived by room id", success: true, data: customers })

    } catch (err) {
        next(err)
    }
}

export const getCustomerByBranchId = async (req, res, next) => {
    try {
        const { branchId } = req.params

        if (!branchId) return res.status(400).json({ message: "Please provide branch id.", success: false })

        const { searchQuery } = req.query
        const filter = {}

        if (searchQuery) filter.customer_name = searchQuery
        filter.branch = branchId

        const customers = await CUSTOMER.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ message: "All customer details retrived by branch id.", success: true, data: customers })

    } catch (err) {
        next(err)
    }
}

export const updateCustomerDetails = async (req, res, next) => {
    try {
        const { customerId } = req.params

        const { customer_name, mobile_no, deposite_amount, room, branch, joining_date } = req.body

        if (!customerId) return res.status(400).json({ message: "Please provide customer id.", success: false })

        const customer = await CUSTOMER.findById(customerId)

        if (!customer) return res.status(404).json({ message: "Customer not found.", success: false })

        if (mobile_no && mobile_no !== customer.mobile_no) {
            const existCustomer = await CUSTOMER.findOne({ mobile_no })

            if (existCustomer) return res.status(409).json({ message: "Customer is already exist with same mobileno.", success: false })

            customer.mobile_no = mobile_no
        }

        if (customer_name) customer.customer_name = customer_name
        if (mobile_no) customer.deposite_amount = deposite_amount
        if (room) customer.room = room
        if (branch) customer.branch = branch
        if (joining_date) customer.joining_date = joining_date

        await customer.save()

        return res.status(200).json({ message: "Customer details updated successfully.", success: true })

    } catch (err) {
        next(err)
    }
}


export const changeStatus = async (req, res, next) => {
    try {
        const { customerId } = req.params

        const { status } = req.body

        if (!customerId || status === undefined) return res.status(400).json({ message: "Please provide customer id and status", success: false })

        const customer = await CUSTOMER.findById(customerId)

        if (!customer) return res.status(404).json({ message: "Customer not found.", success: false })

        const room = await ROOM.findById(customer.room)

        if (!room) return res.status(200).json({ message: "Customer room is missing.", success: false })

        room.filled = room.filled - 1

        customer.status = status

        await room.save()
        await customer.save()

        return res.status(200).json({ message: "Customer status changed successfully", success: true })


    } catch (err) {
        next(err)
    }
}



export const getPendingCustomerRentList = async (req, res, next) => {
    try {
        const { searchQuery, branch } = req.query
        let filter = {
            status: true
        }

        if (searchQuery) {
            filter.customer_name = { $regex: searchQuery, $options: 'i' };
        }

        if (branch) {
            filter.branch = branch
        }

        const customers = await CUSTOMER.find(filter)
            .populate('branch')
            .populate('room')

        const result = []

        for (const customer of customers) {
            const monthList = getMonthYearList(customer.joining_date)

            const rentTransaction = await TRANSACTION.find({
                transactionType: 'income',
                type: 'customer_rent',
                refModel: 'Customerrent',
                branch: customer.branch._id
            }).populate({
                path: 'refId',
                model: 'Customerrent',
                match: { customer: customer._id }
            })

            const paidRentMap = {}

            for (const tx of rentTransaction) {
                const entry = tx.refId;
                if (!entry) continue;

                const key = `${entry.month}-${entry.year}`;
                if (!paidRentMap[key]) {
                    paidRentMap[key] = 0
                }

                paidRentMap[key] += entry.amount;
            }

            const pendingRent = [];

            for (const { month, year } of monthList) {
                const key = `${month}-${year}`
                const paid = paidRentMap[key] || 0
                const pending = Math.max(customer.rent_amount - paid, 0)

                if (pending > 0) {
                    const today = new Date();
                    const currentMonth = today.getMonth() + 1;
                    const currentYear = today.getFullYear()

                    const isRequired = !(month === currentMonth && year === currentYear)

                    pendingRent.push({
                        month,
                        year,
                        pending,
                        required: isRequired
                    })
                }
            }

            if (pendingRent.length > 0) {
                result.push({
                    customerId: customer._id,
                    customer_name: customer.customer_name,
                    branch: customer.branch,
                    room: customer.room,
                    mobile_no: customer.mobile_no,
                    rent_amount: customer.rent_amount,
                    pending_rent: pendingRent
                })
            }

        }

        return res.status(200).json({ message: "Pending customer list fetched successfully.", success: true, data: result })

    } catch (err) {
        next(err)
    }
}

export const getAllCustomerByAcmanager = async (req, res, next) => {
    try {
        const { mongoid } = req;
        const { searchQuery } = req.query

        const isAcmanager = await LOGINMAPPING.findOne({ mongoid, status: true })

        if (!isAcmanager) {
            return res.status(403).json({ message: "You are not Autherizes to access this data.", success: false })
        }

        const acmanger = await ACCOUNT.findOne({ _id: mongoid })

        if (!acmanger) {
            return res.status(404).json({ message: "Acmanager Details Not Found", success: false })
        }

        const branchid = acmanger.branch

        const filter = { branch: { $in: branchid } }

        if (searchQuery) {
            filter.customer_name = { $regex: searchQuery, $options: 'i' }
        }

        const allCustomer = await CUSTOMER.find(filter).populate('branch').populate('room').sort({ createdAt: -1 })

        return res.status(200).json({ message: "All Customer details Retrived by Acmanager.", success: true, data: allCustomer })
    } catch (error) {
        next(error)
    }
}


export const getPendingCustomerRentListByAcmanager = async (req, res, next) => {
    try {
        const { searchQuery } = req.query
        const {mongoid} =req

        const isAcmanager = await LOGINMAPPING.findOne({mongoid,status:true})

        if(!isAcmanager){
            return res.status(403).json({message:"You are not Autherized to access this data.",success:true})
        }

        const acManager = await ACCOUNT.findOne({_id:mongoid})

        if(!acManager){
            return res.status(404).json({message:"Acmanage Details Not Found",success:false})
        }

        const branchid = acManager.branch

        let filter = {
            status: true
        }

        filter = {branch :{ $in:branchid}}

        if (searchQuery) {
            filter.customer_name = { $regex: searchQuery, $options: 'i' };
        }

        const customers = await CUSTOMER.find(filter)
            .populate('branch')
            .populate('room')

        const result = []

        for (const customer of customers) {
            const monthList = getMonthYearList(customer.joining_date)

            const rentTransaction = await TRANSACTION.find({
                transactionType: 'income',
                type: 'customer_rent',
                refModel: 'Customerrent',
                branch: customer.branch._id
            }).populate({
                path: 'refId',
                model: 'Customerrent',
                match: { customer: customer._id }
            })

            const paidRentMap = {}

            for (const tx of rentTransaction) {
                const entry = tx.refId;
                if (!entry) continue;

                const key = `${entry.month}-${entry.year}`;
                if (!paidRentMap[key]) {
                    paidRentMap[key] = 0
                }

                paidRentMap[key] += entry.amount;
            }

            const pendingRent = [];

            for (const { month, year } of monthList) {
                const key = `${month}-${year}`
                const paid = paidRentMap[key] || 0
                const pending = Math.max(customer.rent_amount - paid, 0)

                if (pending > 0) {
                    const today = new Date();
                    const currentMonth = today.getMonth() + 1;
                    const currentYear = today.getFullYear()

                    const isRequired = !(month === currentMonth && year === currentYear)

                    pendingRent.push({
                        month,
                        year,
                        pending,
                        required: isRequired
                    })
                }
            }

            if (pendingRent.length > 0) {
                result.push({
                    customerId: customer._id,
                    customer_name: customer.customer_name,
                    branch: customer.branch,
                    room: customer.room,
                    mobile_no: customer.mobile_no,
                    rent_amount: customer.rent_amount,
                    pending_rent: pendingRent
                })
            }

        }

        return res.status(200).json({ message: "Pending customer list fetched successfully.", success: true, data: result })

    } catch (err) {
        next(err)
    }
}