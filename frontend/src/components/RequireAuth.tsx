import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type RequireAuthProps = {
	userOnly?: boolean;
	adminPrivileges?: boolean;
};

const RequireAuth = ({ userOnly, adminPrivileges }: RequireAuthProps) => {
	const { auth } = useAuth();

	if (auth.isLoggedIn && (
		(adminPrivileges && (auth.role === "ADMIN" || auth.role === "SUPERADMIN")) ||
	   	((userOnly && auth.role === "USER") || !userOnly )
	)) {
		return <Outlet />;
	} else {
		return <Navigate to="/" />;
	}
};

export default RequireAuth;
