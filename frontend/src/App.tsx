import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import Admin from "./Admin/Admin";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Home from "./Home/Home";
import Landing from "./Landing/Landing";
import { UserContext } from "./UserContext/UserContext";
import { useContext } from "react";
import { UserContextType } from "./UserContext/UserContextType";

export type ProtectedRouteProps = {
	adminPrivileges: boolean;
	outlet: JSX.Element;
};

function App() {
	
	const { user } = useContext(UserContext) as UserContextType;

	const ProtectedRoute = ({ adminPrivileges, outlet }: ProtectedRouteProps) => {
		if (
			(adminPrivileges && user.isAdmin) ||
			(!adminPrivileges && user.isLoggedIn)
		) {
			return outlet;
		} else {
			return <Navigate to="/login" />;
		}
	};

	return (
		<>
			<Navbar />
			<Box component="main" sx={{ flex: 1, py: 6, px: 4 }}>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/home"
						element={
							<ProtectedRoute adminPrivileges={false} outlet={<Home />} />
						}
					/>
					<Route
						path="/admin"
						element={
							<ProtectedRoute adminPrivileges={true} outlet={<Admin />} />
						}
					/>
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</Box>
			<Footer />
		</>
	);
}

export default App;
