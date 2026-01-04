export const getPendingMonths = (joiningDate) =>{
    const current = new Date()

    const startMonth = joiningDate.getMonth() + 1
    const startYear = joiningDate.getFullYear()
    const currentMonth = current.getMonth() + 1
    const currentYear = current.getFullYear()

    const results = [];

    for(let y = startYear; y <=currentYear; y++){
        let mStart = y === startYear ? startMonth : 1;
        let mEnd = y === startYear ? currentMonth : 12;
        for (let m = mStart; m<= mEnd; m++){
            results.push({month:m, year: y})
        }
    }
   
    return results
}

export const getMonthYearList = (startDate) =>{
   const start = new Date(startDate)
   const end = new Date()
   const results = []

   let year = start.getFullYear()
   let month = start.getMonth() + 1

   const endYear = end.getFullYear()
   const endMonth = end.getMonth() + 1

   while(year < endYear || (year === endYear && month <= endMonth)){
      results.push({month, year})

      month++;
      if(month > 12){
        month = 1;
        year++;
      }
   }

   return results
}

export const getMonthShortNames = (monthNumber) =>{
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[monthNumber - 1];
}

export const formateTransactionType = (type) => {
   switch(type){
      case "deposite":
        return "Deposite"
      case "rent_attempt":
        return "Rent"
      case "salary_attempt":
        return "Salary"
      case "monthly_bill":
        return "Monthly Bill"
      case "inventory_purchase":
        return "Inventory"
      case "cash_given":
        return "Cash Given"
   }
}