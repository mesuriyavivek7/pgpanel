export const formatDate= (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    return `${day}, ${month} ${year}`;
}


export const capitalise = (str) =>{
    if(!str) return 

    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const errorNameConvertor = (val) =>{
     const word = val.split("_")
    return word.map((char)=> char.charAt(0).toUpperCase() + char.slice(1)).join(" ")
}

export const sliceString = (str,n) =>{
    if(!str) return '-'
    if(str.length > n){
        return str.slice(0,n)+'...'
    }else{
        return str
    }
}

export const getShortMonthName = (monthNumber) =>{
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (monthNumber < 1 || monthNumber > 12) return null;
    return monthNames[monthNumber - 1];
}

export const convertIntoRupees = (amount) =>{
    if(amount===null || amount === undefined) return ''

    if(amount < 0){
        let pos = Math.abs(amount)
        return "-₹"+pos
    }else{
        return "₹"+amount
    }
}