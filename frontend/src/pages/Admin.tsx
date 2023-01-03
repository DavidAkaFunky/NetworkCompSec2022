import {
	Typography,
	Button,
	Box,
	TextField,
	Container,
	Grid,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../interceptors/Axios";

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

	const [users, setUsers] = useState([
		{
			id: "",
			name: "",
			email: "",
		},
	]);

	useEffect(() => {
		const getAllUsers = async () => {
			try {
				const response = await axios.get("/api/users/get-all", {
					withCredentials: true,
				});
				console.log(response.data);
				return response.data;
			} catch (err: any) {
				console.log(err);
				return [];
			}
		};

		getAllUsers().then((data) => {
			setUsers(data);
		});
	}, []);

	const handleClick = async (e: any) => {
		navigate("/register-admin");
	};

	const handleSubmit = async (e: any) => {
		try {
			const response = await axios.post("/api/stocks/create", {
				withCredentials: true,
				name: stock.name,
				ISIN: stock.ISIN,
				exchange: stock.exchange,
				lastPrice: stock.lastPrice,
				volume: stock.volume,
			});

			// Reset
			setStock({
				name: "",
				ISIN: "",
				exchange: "",
				lastPrice: "",
				volume: "",
			});
		} catch (err: any) {
			console.log(err);
		}
	};

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
									id="exchange"
									label={"Exchange"}
									name="exchange"
									autoFocus
									value={stock.exchange}
									onChange={(e) =>
										setStock({ ...stock, exchange: e.target.value })
									}
								/>
								<TextField
									margin="normal"
									variant="filled"
									required
									fullWidth
									id="lastPrice"
									label={"Last Price"}
									name="lastPrice"
									autoFocus
									value={stock.lastPrice}
									onChange={(e) =>
										setStock({ ...stock, lastPrice: e.target.value })
									}
								/>
								<TextField
									margin="normal"
									variant="filled"
									required
									fullWidth
									id="volume"
									label={"Volume"}
									name="volume"
									autoFocus
									value={stock.volume}
									onChange={(e) =>
										setStock({ ...stock, volume: e.target.value })
									}
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
							<Table sx={{ minWidth: 650 }}>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell align="right">Email</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users.map((user) => (
										<TableRow
											key={user.id}
											sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
											onClick={() => {
												console.log(user);
											}}
										>
											<TableCell component="th" scope="row">
												{user.name}
											</TableCell>
											<TableCell align="right">{user.email}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}

export default Admin;
