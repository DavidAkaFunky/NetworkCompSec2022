import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import RegisterAdmin from "./pages/RegisterAdmin";
import CertificationAuthority from "./pages/CertificationAuthority";

function App() {
	return (
		<>
			<Navbar />
			<Box component="main" sx={{ flex: 1, py: 6, px: 4 }}>
				<Routes>
					<Route element={<PersistLogin />}>
						{/* Public routes */}
						<Route path="/" element={<Landing />} />
						<Route path="/ca" element={<CertificationAuthority />} />
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						{/* Protected routes */}
						<Route element={<RequireAuth adminPrivileges={false} />}>
							<Route path="/home" element={<Home />} />
						</Route>
						<Route element={<RequireAuth adminPrivileges={true} />}>
							<Route path="/register-admin" element={<RegisterAdmin />} />
							<Route path="/admin" element={<Admin />} />
						</Route>
						{/* Fallback route */}
						<Route path="/*" element={<Navigate to="/" />} />
					</Route>
				</Routes>
			</Box>
			<Footer />
		</>
	);
}

export default App;
