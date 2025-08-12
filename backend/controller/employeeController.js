import EMPLOYEE from "../models/EMPLOYEE.js";
import { getMonthYearList } from "../helper.js";
import TRANSACTION from "../models/TRANSACTION.js";


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

export const getEmployeePendingSalaries = async (req, res, next) =>{
    try{
        const employees = await EMPLOYEE.find({status:true}).populate('branch')

        const result = []

        for(const employee of employees){
            const monthList = getMonthYearList(employee.createdAt)

            const salaryTransaction = await TRANSACTION.find({
                transactionType:'expense',
                type:'employee_salary',
                refModel:'Employeesalary',
                branch:employee.branch._id
            }).populate({
                path:'refId',
                model:'Employeesalary',
                match:{employee: employee._id}
            })

            const paidSalaryMap = {}

            for (const tx of salaryTransaction){
                const entry = tx.refId;
                if(!entry) continue;

                const key = `${entry.month}-${entry.year}`;
                if(!paidSalaryMap[key]){
                    paidSalaryMap[key] = 0
                }

                paidSalaryMap[key] += entry.amount;
            }

            const pendingSalary = [];

            for(const {month, year} of monthList){
                const key = `${month}-${year}`
                const paid = paidSalaryMap[key] || 0
                const pending = Math.max(employee.salary - paid, 0)

                if(pending > 0){
                    const today = new Date();
                    const currentMonth = today.getMonth() + 1;
                    const currentYear = today.getFullYear()

                    const isRequired = !(month === currentMonth && year === currentYear)

                    pendingSalary.push({
                        month,
                        year,
                        pending,
                        required: isRequired
                    })
                }
            }

            if(pendingSalary.length > 0){
                result.push({
                    employeeId:employee._id,
                    employee_name:employee.employee_name,
                    employee_type:employee.employee_type,
                    mobile_no:employee.mobile_no,
                    salary:employee.salary,
                    branch:employee.branch.branch_name,
                    pending_salary:pendingSalary
                })
            }
        }
        
        return res.status(200).json({message:"All salary details retrived successfully.",success:true, data:result})

    }catch(err){
        next(err)
    }
}