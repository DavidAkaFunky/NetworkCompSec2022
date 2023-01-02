import {
	Typography,
	Button,
	Box,
	TextField,
	Container,
	Grid,
	Paper,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Admin() {
	const { auth } = useAuth();
	const navigate = useNavigate();

	const [stock, setStock] = useState({
		name: "",
		ISIN: "",
		exchange: "",
		lastPrice: "",
		volume: "",
	});

	const handleClick = async (e: any) => {
		navigate("/register-admin");
	};

	const handleSubmit = async (e: any) => {};

	return (
		<>
			<Typography component="h2" variant="h3" align="left">
				Admin
			</Typography>
			{auth.role === "SUPERADMIN" && (
				<Button
					onClick={handleClick}
					variant="contained"
					sx={{ mt: 3, width: 200, height: 30 }}
				>
					Register Admin
				</Button>
			)}
			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={4} lg={4}>
						<Paper
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Typography
								component="h2"
								variant="h6"
								color="primary"
								gutterBottom
							>
								Create New Stock
							</Typography>
							<Box component="form">
								<TextField
									margin="normal"
									variant="filled"
									required
									fullWidth
									id="name"
									label={"Stock name"}
									name="name"
									autoFocus
									value={stock.name}
									onChange={(e) => setStock({ ...stock, name: e.target.value })}
								/>
								<TextField
									margin="normal"
									variant="filled"
									required
									fullWidth
									name="ISIN"
									label={"ISIN"}
									id="ISIN"
									value={stock.ISIN}
									onChange={(e) => setStock({ ...stock, ISIN: e.target.value })}
								/>
								<TextField
									margin="normal"
									variant="filled"
									required
									fullWidth
									id="name"
									label={"Stock name"}
									name="name"
									autoFocus
									value={stock.name}
									onChange={(e) => setStock({ ...stock, name: e.target.value })}
								/>
								<TextField
									margin="normal"
									variant="filled"
									required
									fullWidth
									id="name"
									label={"Stock name"}
									name="name"
									autoFocus
									value={stock.name}
									onChange={(e) => setStock({ ...stock, name: e.target.value })}
								/>
								<TextField
									margin="normal"
									variant="filled"
									required
									fullWidth
									id="name"
									label={"Stock name"}
									name="name"
									autoFocus
									value={stock.name}
									onChange={(e) => setStock({ ...stock, name: e.target.value })}
								/>
								<Button
									fullWidth
									onClick={handleSubmit}
									variant="contained"
									sx={{ mt: 3 }}
									disabled={
										!stock.name ||
										!stock.ISIN ||
										!stock.exchange ||
										!stock.lastPrice ||
										!stock.volume
									}
								>
									Submit
								</Button>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={12} md={8} lg={8}>
						<Paper
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Typography
								component="h2"
								variant="h6"
								color="primary"
								gutterBottom
							>
								All users
							</Typography>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}

export default Admin;
