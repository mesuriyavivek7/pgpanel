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
    if(str.length > n){
        return str.slice(0,n)+'...'
    }else{
        return str
    }
}