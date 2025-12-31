import EMPLOYEE from "../models/EMPLOYEE.js";
import { getMonthYearList } from "../helper.js";
import TRANSACTION from "../models/TRANSACTION.js";
import ACCOUNT from "../models/ACCOUNT.js";
import BRANCH from "../models/BRANCH.js";
import LOGINMAPPING from "../models/LOGINMAPPING.js";
import EMPLOYEESALARY from "../models/EMPLOYEESALARY.js";



export const createEmployee = async (req, res, next) => {
    try {
        const { mongoid, userType } = req
        const { employee_name, mobile_no, salary, employee_type, branch } = req.body

        if (userType === 'Account') {
            const acmanager = await ACCOUNT.findById(mongoid)

            if (!acmanager) {
                return res.status(404).json({ message: "Account Manager Not Fount.", success: false })
            }

            if (!acmanager.branch.includes(branch)) {
                return res.status(403).json({ message: "You are not Autherized to add employee in this branch.", success: false })
            }
        }

        if (!employee_name || !mobile_no || !salary || !employee_type) return res.status(400).json({ message: "Please provide all required fields.", success: false })

        const existEmployee = await EMPLOYEE.findOne({ mobile_no, branch })

        if (existEmployee) return res.status(409).json({ message: "Employee is already exist with same mobile no.", success: false })

        const newEmployee = new EMPLOYEE({
            employee_name,
            mobile_no,
            salary,
            employee_type,
            branch,
            added_by: mongoid,
            added_by_type: userType
        })

        const newEmployeeSalary = new EMPLOYEESALARY({
            employee: newEmployee._id,
            salary,
            month: (new Date()).getMonth() + 1,
            year: (new Date()).getFullYear()
        })

        await newEmployee.save()
        await newEmployeeSalary.save()

        return res.status(200).json({ message: "New employee created successfully.", success: true })

    } catch (err) {
        next(err)
    }
}

export const getAllEmployee = async (req, res, next) => {
    try {
        const { searchQuery, branch } = req.query;

        const filter = {};

        const { userType, mongoid } = req

        if (userType === 'Account') {
            const acmanager = await ACCOUNT.findById(mongoid)

            if (!acmanager) {
                return res.status(404).json({ message: "Account manager not found.", success: false })
            }

            if (branch) {
                if (!acmanager.branch.includes(branch)) {
                    return res.status(403).json({ message: "You are not Autherized to view Employee in this Branch.", success: false })
                }

                filter.branch = branch
            } else {
                filter.branch = { $in: acmanager.branch }
            }
        } else {
            if (branch) filter.branch = branch
        }

        if (searchQuery) filter.employee_name = { $regex: searchQuery, $options: 'i' };

        const employee = await EMPLOYEE.find(filter)
            .populate('branch')
            .populate('added_by')
            .sort({ createdAt: -1 });

        return res.status(200).json({ message: "All employee details retrived.", success: true, data: employee })


    } catch (err) {
        next(err)
    }
}

export const updateEmployee = async (req, res, next) => {
    try {
        const { employeeId } = req.params

        const { userType, mongoid } = req

        if (userType === 'Account') {
            const acmanager = await ACCOUNT.findById(mongoid)

            if (!acmanager) {
                return res.status(404).json({ message: "Account manager not found.", success: false })
            }

            if (!acmanager.branch.includes(branch)) {
                return res.status(403).json({ message: "You are not Autherized to Update Employee in this Branch.", success: false })
            }
        }

        const { employee_name, salary, branch, mobile_no, employee_type } = req.body

        if (!employeeId) return res.status(400).json({ message: "please provide employee id", success: false })

        const employee = await EMPLOYEE.findById(employeeId)

        if (!employee) return res.status(404).json({ message: "Employee not found.", success: false })

        if (mobile_no && employee.mobile_no !== mobile_no) {
            const existEmployee = await EMPLOYEE.findOne({ mobile_no })

            if (existEmployee) return res.status(409).json({ message: "Employee is already exist with same mobile no.", success: false })
        }

        if (employee_name) employee.employee_name = employee_name
        if (salary) {
            if (salary < employee.salary) {
              return res.status(400).json({
                message: "Salary amount cannot be less than previous salary amount.",
                success: false,
              });
            }
          
            // Get current month & year
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
          
            // Find all future salary records for this employee (including current month)
            const futureSalaries = await EMPLOYEESALARY.find({
              employee: employee._id,
              $or: [
                { year: { $gt: currentYear } },
                { year: currentYear, month: { $gte: currentMonth } },
              ],
            });
          
            if (futureSalaries.length > 0) {
              // Update salary for all current and future records
              await EMPLOYEESALARY.updateMany(
                {
                  employee: employee._id,
                  $or: [
                    { year: { $gt: currentYear } },
                    { year: currentYear, month: { $gte: currentMonth } },
                  ],
                },
                {
                  $set: {
                    salary: salary,
                    status: "Pending",
                  },
                }
              );
            }
          
            // Update employee’s salary
            employee.salary = salary;
            await employee.save();
        }          
        if (branch) employee.branch = branch
        if (mobile_no) employee.mobile_no = mobile_no
        if (employee_type) employee.employee_type = employee_type

        await employee.save()

        return res.status(200).json({ message: "Employee is details updated successfully.", success: false, data: employee })

    } catch (err) {
        next(err)
    }
}

export const changeEmployeeStatus = async (req, res, next) => {
    try {
        const { employeeId } = req.params
        const { userType, mongoid } = req

        const { status } = req.body

        if (!employeeId || status === undefined) return res.status(400).json({ message: "Please provide all required fields.", success: false })

        const employee = await EMPLOYEE.findById(employeeId)

        if (!employee) return res.status(400).json({ message: "Employee is not found.", success: false })

        if (userType === 'Account') {
            const acmanager = await ACCOUNT.findById(mongoid)

            if (!acmanager) {
                return res.status(404).json({ message: "Account manager not found.", success: false })
            }

            if (!acmanager.branch.includes(employee.branch)) {
                return res.status(403).json({ message: "You are not Autherized to Change Employee Status in this Branch.", success: false })
            }
        }

        employee.status = status

        await employee.save()

        return res.status(200).json({ message: "Employee status changed successfully.", success: true })

    } catch (err) {
        next(err)
    }
}

// export const getEmployeePendingSalaries = async (req, res, next) => {
//     try {
//         const { searchQuery, branch } = req.query
//         let filter = { status: true }

//         const { userType, mongoid } = req

//         let employees = []

//         if (userType === 'Account') {

//             const acManager = await ACCOUNT.findById(mongoid)

//             if(!acManager){
//                 return res.status(404).json({ message: "Account Manager Not Found.", success: false })
//             }

//             const branchId = acManager.branch

//             if (branch) {
                
//                 if (!branchId.includes(branch)) {
//                     return res.status(403).json({ message: "You are not Autherized to access this Branch.", success: false })
//                 }

//                 filter.branch = branch
//             } else {
//                 filter.branch = { $in: branchId }
//             }

//         } else {
//             if(branch){
//                 filter.branch = branch
//             }
//         }

//         if (searchQuery) {
//             filter.employee_name = { $regex: searchQuery, $options: 'i' };
//         }

//         employees = await EMPLOYEE.find(filter).populate('branch')

//         if (searchQuery) {
//             filter.employee_name = { $regex: searchQuery, $options: 'i' };
//         }

//         const result = []

//         for (const employee of employees) {
//             const monthList = getMonthYearList(employee.createdAt)

//             const salaryTransaction = await TRANSACTION.find({
//                 transactionType: 'expense',
//                 type: 'employee_salary',
//                 refModel: 'Employeesalary',
//                 branch: employee.branch._id
//             }).populate({
//                 path: 'refId',
//                 model: 'Employeesalary',
//                 match: { employee: employee._id }
//             })

//             const paidSalaryMap = {}

//             for (const tx of salaryTransaction) {
//                 const entry = tx.refId;
//                 if (!entry) continue;

//                 const key = `${entry.month}-${entry.year}`;
//                 if (!paidSalaryMap[key]) {
//                     paidSalaryMap[key] = 0
//                 }

//                 paidSalaryMap[key] += entry.amount;
//             }

//             const pendingSalary = [];

//             for (const { month, year } of monthList) {
//                 const key = `${month}-${year}`
//                 const paid = paidSalaryMap[key] || 0
//                 const pending = Math.max(employee.salary - paid, 0)

//                 if (pending > 0) {
//                     const today = new Date();
//                     const currentMonth = today.getMonth() + 1;
//                     const currentYear = today.getFullYear()

//                     const isRequired = !(month === currentMonth && year === currentYear)

//                     pendingSalary.push({
//                         month,
//                         year,
//                         pending,
//                         required: isRequired
//                     })
//                 }
//             }

//             if (pendingSalary.length > 0) {
//                 result.push({
//                     employeeId: employee._id,
//                     employee_name: employee.employee_name,
//                     employee_type: employee.employee_type,
//                     mobile_no: employee.mobile_no,
//                     salary: employee.salary,
//                     branch: employee.branch.branch_name,
//                     pending_salary: pendingSalary
//                 })
//             }
//         }

//         return res.status(200).json({ message: "All salary details retrived successfully.", success: true, data: result })

//     } catch (err) {
//         next(err)
//     }
// }


export const getEmployeePendingSalaries = async (req, res, next) =>{
    try{
      const {searchQuery, branch} = req.query 

      const {mongoid, userType} = req 

      let filter = {status: true}

      if (searchQuery) {
        filter.employee_name = { $regex: searchQuery, $options: 'i' };
      }

      if(userType === "Account"){
        const account = await ACCOUNT.findById(mongoid) 

        if(!account) return res.status(400).json({message:"Account manager not found.",success:false})

        if(branch) {
            if(!account.branch.includes(branch)) return res.status(403).json({message:"You have no access to get pending rents of requested branch.",success:false})

            filter.branch = branch
        }else{
            filter.branch = { $in: account.branch };
        }
      }else {
        if(branch){
            filter.branch = branch
        }
      }

      const employees = await EMPLOYEE.find(filter)
      .populate('branch')
      .sort({createdAt:-1})

      const result = [] 

      for (const employee of employees){
        const pendingSalary = await EMPLOYEESALARY.find({employee:employee._id, status:'Pending'})

        const pendingSalaryMap = [] 

        for(const employeeSalary of pendingSalary){
            const isRequired = !(employeeSalary.month === (new Date()).getMonth() + 1 && employeeSalary.year === (new Date()).getFullYear())
            pendingSalaryMap.push({
                month:employeeSalary.month,
                year:employeeSalary.year,
                pending: employeeSalary.salary - employeeSalary.paid_amount,
                required:isRequired
            })
        }

        if(pendingSalaryMap.length > 0){
            result.push({
                employeeId:employee._id,
                employee_name:employee.employee_name,
                employee_type:employee.employee_type,
                mobile_no:employee.mobile_no,
                salary:employee.salary,
                branch:employee.branch.branch_name,
                pending_salary:pendingSalaryMap
            })
        }
      }

      return res.status(200).json({message:"All pending salary details retrived successfully.",success:true,data:result})

    }catch(err){
      next(err)
    }
}