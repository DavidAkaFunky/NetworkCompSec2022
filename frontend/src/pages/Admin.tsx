import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Admin() {
	const navigate = useNavigate();

	const handleClick = async (e: any) => {
		navigate("/register-admin");
	}

	return (
		<>
			<Typography component="h2" variant="h3" align="left">
				Admin
			</Typography>
			<Button
				
				onClick={handleClick}
				variant="contained"
				sx={{ mt: 3 , width: 200, height: 30}}
			>
				Register Admin
			</Button>
		</>
	);
}

export default Admin;
