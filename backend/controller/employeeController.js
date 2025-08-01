import EMPLOYEE from "../models/EMPLOYEE.js";


export const createEmployee = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req
        const {employee_name, mobile_no, salary, employee_type, branch} = req.body

        if(!employee_name || !mobile_no || !salary || !employee_type) return res.status(400).json({message:"Please provide all required fields.",success:false})

        const existEmployee = await EMPLOYEE.findOne({mobile_no,branch})

        if(existEmployee) return res.status(409).json({message:"Employee is already exist with same mobile no.",success:false})

        const newEmployee = new EMPLOYEE({
            employee_name,
            mobile_no,
            salary,
            employee_type,
            branch,
            added_by:mongoid,
            added_by_type:userType
        })

        await newEmployee.save()

        return res.status(200).json({message:"New employee created successfully.",success:true})

    }catch(err){
        next(err)
    }
}

export const getAllEmployee = async (req, res, next) =>{
    try{
       const {searchQuery, branch } = req.query;

       const filter = {};

       if(searchQuery) filter.employee_name = { $regex: searchQuery, $options: 'i' };

       if(branch) filter.branch = branch

       const employee = await EMPLOYEE.find(filter)
       .populate('branch')
       .populate('added_by')
       .sort({ createdAt: -1 });

       return res.status(200).json({message:"All employee details retrived.",success:true,data:employee})

    }catch(err){
        next(err)
    }
}

export const updateEmployee = async (req, res, next) =>{
    try{
        const {employeeId} = req.params

        const {employee_name, salary, branch, mobile_no, employee_type} = req.body

        if(!employeeId) return res.status(400).json({message:"please provide employee id",success:false})

        const employee = await EMPLOYEE.findById(employeeId)

        if(!employee) return res.status(404).json({message:"Employee not found.",success:false})

        if(mobile_no && employee.mobile_no !== mobile_no){
            const existEmployee = await EMPLOYEE.findOne({mobile_no})

            if(existEmployee) return res.status(409).json({message:"Employee is already exist with same mobile no.",success:false})
        }

        if(employee_name) employee.employee_name = employee_name
        if(salary) employee.salary = salary
        if(branch) employee.branch = branch
        if(mobile_no) employee.mobile_no = mobile_no
        if(employee_type) employee.employee_type = employee_type

        await employee.save()

        return res.status(200).json({message:"Employee is details updated successfully.",success:false,data:employee})

    }catch(err){
        next(err)
    }
}

export const changeEmployeeStatus = async (req, res, next) =>{
    try{
        const {employeeId} = req.params 

        const {status} = req.body

        console.log(status)

        if(!employeeId || status===undefined) return res.status(400).json({message:"Please provide all required fields.",success:false})

        const employee = await EMPLOYEE.findById(employeeId)

        if(!employee) return res.status(400).json({message:"Employee is not found.",success:false})

        employee.status = status 

        await employee.save()

        return res.status(200).json({message:"Employee status changed successfully.",success:true})

    }catch(err){
        next(err)
    }
}