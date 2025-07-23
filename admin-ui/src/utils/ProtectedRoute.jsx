import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function ProtectedRoute({children, allowed}) {
  const {auth} = useAuth()  

  if(auth.loading) return <Loader></Loader>
  if(!auth.token  || !auth.user) return <Navigate to={'/login'}></Navigate>
  if(allowed && !allowed.includes(auth.user.userType)) return <Navigate to={'/login'}></Navigate>

  return children
  
}

export default ProtectedRoute