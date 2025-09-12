import ACCOUNT from "../models/ACCOUNT.js";
import BRANCH from "../models/BRANCH.js";
import ROOM from "../models/ROOM.js";


export const createRoom = async (req, res, next) => {
    try {
        const { mongoid, userType } = req
        const { room_id, capacity, branch, remark } = req.body

        if (userType === 'Account') {
            const acmanager = await ACCOUNT.findById(mongoid)

            if (!acmanager) {
                return res.status(404).json({ message: "Account manager not Found.", success: false })
            }
            if (!acmanager.branch.includes(branch)) {
                return res.status(403).json({ message: "You are not Autherized to add Room in this Branch.", success: false })
            }
        }

        if (!room_id || !capacity || !branch) return res.status(400).json({ message: "Please provide all required fields.", success: false })

        const existRoom = await ROOM.findOne({ room_id, branch })

        if (existRoom) return res.status(409).json({ message: "Room is already exist with given room no.", success: false })

        const existBranch = await BRANCH.findById(branch)

        if (!existBranch) return res.status(404).json({ message: "Branch not found.", success: false })

        const newBranch = await ROOM({
            room_id,
            capacity,
            branch,
            remark,
            added_by: mongoid,
            added_by_type: userType
        })

        await newBranch.save()

        return res.status(201).json({ message: "New room created successfully.", success: true, data: branch })

    } catch (err) {
        next(err)
    }
}


export const updateRoom = async (req, res, next) => {
    try {
        const { roomId } = req.params

        const { room_id, capacity, remark } = req.body

        const { mongoid , userType} = req

        const room = await ROOM.findById(roomId)

        if (!room) return res.status(404).json({ message: "Room not found.", success: false })

        if (userType === 'Account') {
            const acmanager = await ACCOUNT.findById(mongoid)

            if (!acmanager) {
                return res.status(404).json({ message: "Account manager not Found.", success: false })
            }
            if (!acmanager.branch.includes(room.branch)) {
                return res.status(403).json({ message: "You are not Autherized to Update Room in this Branch.", success: false })
            }
        }


        if (room_id && room.room_id !== room_id) {
            const existRoom = await ROOM.findOne({ room_id })

            if (existRoom) return res.status(409).json({ message: "Room already exist with given room no.", success: false })

            room.room_id = room_id
        }

        if (capacity) {
            room.capacity = capacity
        }

        if (remark) {
            room.remark = remark
        }

        await room.save()

        return res.status(200).json({ message: "Room details updated successfully.", success: true, data: room })

    } catch (err) {
        next(err)
    }
}

export const getRoomByBranchId = async (req, res, next) => {
    try {
        const { mongoid, userType } = req

        const { branchId } = req.params

        if (!branchId) return res.status(400).json({ message: "Please provide branch id.", success: false })

        if (userType === 'Account') {
            const acmanager = await ACCOUNT.findById(mongoid)

            if (!acmanager) {
                return res.status(404).json({ message: "Account manager not Found.", success: false })
            }
            if (!acmanager.branch.includes(branchId)) {
                return res.status(403).json({ message: "You are not Autherized to add Room in this Branch.", success: false })
            }
        }

        const branch = await BRANCH.findById(branchId)

        if (!branch) return res.status(404).json({ message: "Branch not found.", success: false })

        const rooms = await ROOM.find({ branch: branchId }).populate('branch')

        return res.status(200).json({ message: "Rooms retrived successfuly.", success: false, data: rooms })

    } catch (err) {
        next(err)
    }
}

export const getRoomById = async (req, res, next) => {
    try {
        const { roomId, userType } = req.params

        if (!roomId) return res.status(400).json({ message: "Please provide room id.", success: false })

        const room = await ROOM.findById(roomId).populate('branch')

        if (!room) return res.status(404).json({ message: "Room not found.", success: false })

        if (userType === 'Account') {
            const acmanager = await ACCOUNT.findById(mongoid)

            if (!acmanager) {
                return res.status(404).json({ message: "Account manager not Found.", success: false })
            }
            if (!acmanager.branch.includes(room.branch)) {
                return res.status(403).json({ message: "You are not Autherized to add Room in this Branch.", success: false })
            }
        }

        return res.status(200).json({ message: "Room details retrived successfully.", success: true, data: room })

    } catch (err) {
        next(err)
    }
}