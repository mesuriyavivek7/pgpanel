import cron from 'node-cron';
import CUSTOMER from '../models/CUSTOMER.js';
import CUSTOMERRENT from '../models/CUSTOMERRENT.js';
import EMPLOYEE from '../models/EMPLOYEE.js';
import EMPLOYEESALARY from '../models/EMPLOYEESALARY.js';

const createMonthlyCustomerRentTask = async () => {

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();


     //For customers
     const customers = await CUSTOMER.find({status:true});

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
 
     if(newRents.length > 0){
         await CUSTOMERRENT.insertMany(newRents);
         console.log(`Created ${newRents.length} new customer rent records for ${month}/${year}`);
     } else {
         console.log("All customers already have rent records for this month.");
     }
}

const createEmployeeSalaryTask = async () => {

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

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

    if(newSalaries.length > 0){
        await EMPLOYEESALARY.insertMany(newSalaries);
        console.log(`Created ${newSalaries.length} new employee salary records for ${month}/${year}`);
    } else {
        console.log("All employees already have salary records for this month.");
    }

}




cron.schedule('0 0 1 * *', async () => {
    await createMonthlyCustomerRentTask();
    await createEmployeeSalaryTask();
})