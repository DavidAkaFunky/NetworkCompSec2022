import { Routes, Route } from "react-router-dom";
import { Box, ThemeProvider } from "@mui/material";
import Services from "./Services/Services";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import Admin from "./Admin/Admin";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Home from "./Home/Home";

function App() {
	return (
		<>
			<Navbar />
			<Box component="main" sx={{ flex: 1, py: 6, px: 4 }}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/services" element={<Services />} />
					<Route path="/admin" element={<Admin />} />
				</Routes>
			</Box>
			<Footer />
		</>
	);
}

export default App;
