import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type RequireAuthProps = {
	userOnly?: boolean;
	adminPrivileges?: boolean;
};

const RequireAuth = ({ userOnly, adminPrivileges }: RequireAuthProps) => {
	const { auth } = useAuth();

	console.log("auth.isLoggedIn: " + auth.isLoggedIn);
	console.log("auth.role: " + auth.role);
	console.log("userOnly: " + userOnly);
	console.log("adminPrivileges: " + adminPrivileges);

	if (auth.isLoggedIn && (
		(adminPrivileges && (auth.role === "ADMIN" || auth.role === "SUPERADMIN")) ||
	   	(!adminPrivileges && (!userOnly || (!userOnly && auth.role === "USER")))
	)) {
		return <Outlet />;
	} else {
		return <Navigate to="/" />;
	}

	/*if (
		(adminPrivileges && (auth.role === "ADMIN" || auth.role === "SUPERADMIN")) ||
		(!adminPrivileges && auth.isLoggedIn)
	) {
		return <Outlet />;
	} else {
		return <Navigate to="/login" />;
	}*/
};

export default RequireAuth;
