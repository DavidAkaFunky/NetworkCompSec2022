import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthContextType } from "../context/AuthContextType";

const useAuth = () => {
	return useContext(AuthContext) as AuthContextType;
};

export default useAuth;
