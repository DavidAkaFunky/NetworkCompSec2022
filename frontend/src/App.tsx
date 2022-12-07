import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { Routes, Route } from "react-router-dom";
import Admin from "./Admin/Admin";
import Home from "./Home/Home";

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/admin" element={<Admin />} />
			</Routes>
			<Footer />
		</>
	);
}

export default App;
