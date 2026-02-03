import cron from 'node-cron';
import CUSTOMER from '../models/CUSTOMER.js';
import CUSTOMERRENT from '../models/CUSTOMERRENT.js';
import EMPLOYEE from '../models/EMPLOYEE.js';
import EMPLOYEESALARY from '../models/EMPLOYEESALARY.js';
import CRONLOGS from '../models/CRONLOGS.js';

const createMonthlyCustomerRentTask = async (month, year) => {

    try{
     //For customers
     const customers = await CUSTOMER.find({status:"Active"});

     const newRents = [];
 
     for(const cust of customers){
         const existingRent = await CUSTOMERRENT.findOne({customer:cust._id, month, year});
 
         if(!existingRent){
             newRents.push({
                 customer:cust._id,
                 rent:cust.rent_amount,
                 paid_amount:0,
                 status:'Pending',
                 month,
                 year
             });
         }
     }

     let status = "Success";
     let count = 0;
 
     if(newRents.length > 0){
         await CUSTOMERRENT.insertMany(newRents);
         count = newRents.length;
         console.log(`Created ${newRents.length} new customer rent records for ${month}/${year}`);
     } else {
         console.log("All customers already have rent records for this month.");
     }

     await CRONLOGS.create({
        task:'Customer Rent Generation',
        month,
        year,
        status,
        count
       })

    } catch(error){
       console.error(`❌ Error creating rent for ${month}/${year}:`, err.message);

       await CRONLOGS.create({
        task:'Customer Rent Generation',
        month,
        year,
        status:'Failed',
        count:0
       })
    }
}

const createEmployeeSalaryTask = async (month , year) => {

    try{
    //For Employees
    const employee = await EMPLOYEE.find({status:true});

    const newSalaries = [];
    for(const emp of employee){
        const existingSalary = await EMPLOYEESALARY.findOne({employee:emp._id, month, year});

        if(!existingSalary){
            newSalaries.push({
                employee:emp._id,
                salary:emp.salary,
                paid_amount:0,
                status:'Pending',
                month,
                year
            });
        }
    }

    let status = "Success";
    let count = 0;

    if(newSalaries.length > 0){
        await EMPLOYEESALARY.insertMany(newSalaries);
        count = newSalaries.length;
        console.log(`Created ${newSalaries.length} new employee salary records for ${month}/${year}`);
    } else {
        console.log("All employees already have salary records for this month.");
    }

    await CRONLOGS.create({
        task:'Employee Salary Generation',
        month,
        year,
        status,
        count
    })

    } catch(err){
        console.error(`❌ Error creating rent for ${month}/${year}:`, err.message);

        await CRONLOGS.create({
         task:'Employee Salary Generation',
         month,
         year,
         status:'Failed',
         count:0
        })
    }

}


const checkAndRecoverMissedRentCrons = async () =>{
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const lastLog = await CRONLOGS.findOne({task:'Customer Rent Generation', status:'Success'}).sort({year:-1, month:-1});
    let startMonth, startYear;

    if(lastLog){
      startMonth = lastLog.month;
      startYear = lastLog.year; 
    }else{
      startMonth = currentMonth - 1;
      startYear = currentYear;  
    }

    const missedMonths = [] 
    let y = startYear;
    let m = startMonth;

    while (y < currentYear || (y === currentYear && m < currentMonth)) {
        m++;
        if (m > 12) {
            m = 1;
            y++;
        }
        missedMonths.push({month: m, year: y});
    }

    for(const {month, year } of missedMonths){
        const existLog = await CRONLOGS.findOne({task:'Customer Rent Generation', month, year, status:'Success'});

        if(!existLog){
            console.log(`🔄 Recovering missed cron for ${month}/${year}`);
            await createMonthlyCustomerRentTask(month, year);
        } else{
            console.log(`✅ Cron already completed for ${month}/${year}`);
        }
    }

}

const checkAndRecoverMissedSalaryCrons = async () =>{
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const lastLog = await CRONLOGS.findOne({task:'Employee Salary Generation', status:'Success'}).sort({year:-1, month:-1});
    let startMonth, startYear;

    if(lastLog){
      startMonth = lastLog.month;
      startYear = lastLog.year; 
    }else{
      startMonth = currentMonth - 1;
      startYear = currentYear;  
    }

    const missedMonths = [] 
    let y = startYear;
    let m = startMonth;

    while (y < currentYear || (y === currentYear && m < currentMonth)) {
        m++;
        if (m > 12) {
            m = 1;
            y++;
        }
        missedMonths.push({month: m, year: y});
    }

    for(const {month, year } of missedMonths){
        const existLog = await CRONLOGS.findOne({task:'Employee Salary Generation', month, year, status:'Success'});

        if(!existLog){
            console.log(`🔄 Recovering missed cron for ${month}/${year}`);
            await createEmployeeSalaryTask(month, year);
        } else{
            console.log(`✅ Cron already completed for ${month}/${year}`);
        }
    }
}


cron.schedule('0 0 1 * *', async () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    await createMonthlyCustomerRentTask(month, year);
    await createEmployeeSalaryTask(month, year);
})

export const initCronsJobs = async () =>{
    await checkAndRecoverMissedRentCrons();
    await checkAndRecoverMissedSalaryCrons();
}

