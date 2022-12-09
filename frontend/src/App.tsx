import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { Routes, Route } from "react-router-dom";
import Admin from "./Admin/Admin";
import Home from "./Home/Home";
import Services from "./Services/Services";
import { Box } from "@mui/material";

function App() {
	return (
		<>
			<Navbar />
			<Box component="main" sx={{ flex: 1, py: 6, px: 4 }}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/servicse" element={<Services />} />
					<Route path="/admin" element={<Admin />} />
				</Routes>
			</Box>
			<Footer />
		</>
	);
}

export default App;
