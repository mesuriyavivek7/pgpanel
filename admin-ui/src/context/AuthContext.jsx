import { createContext, useContext, useState, useEffect } from "react";
import { validateToken } from "../services/authService";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({token:null, user:null, loading:true})

    const loginSuccess = (data) =>{
      setAuth({token:data.token, user:{id:data.userId, userType:data.userType}, loading:false})
    }

    const loginFailure = () =>{
        setAuth({token:null, user:null, loading:false})
    }

    useEffect(()=>{
        const checkAuth = async () => {
            try{
               setAuth({token:null, user: null, loading:true})
               const res = await validateToken()
               setAuth({token:res.token, user:{id:res.userId,userType:res.userType}, loading:false});
            }catch(err){
               setAuth({token:null, user:null, loading:false})
            }
        }

        checkAuth();
    },[])


    return (
        <AuthContext.Provider value={{auth, setAuth, loginSuccess, loginFailure}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);