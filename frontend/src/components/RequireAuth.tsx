import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export type RequireAuthProps = {
	adminPrivileges: boolean;
};

const RequireAuth = ({ adminPrivileges }: RequireAuthProps) => {
    const { auth } = useAuth();

    if (
        (adminPrivileges && auth.isAdmin) ||
        (!adminPrivileges && auth.isLoggedIn)
    ) {
        return <Outlet/>;
    } else {
        return <Navigate to="/login" />;
    }
}

export default RequireAuth;