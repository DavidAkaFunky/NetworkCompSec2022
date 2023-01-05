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
	Stack,
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

	const [stocks, setStocks] = useState([
		{
			id: "",
			name: "",
			ISIN: "",
			exchange: "",
			lastPrice: "",
			volume: "",
		},
	]);

	const priceRegex = /^[0-9]+[.,][0-9]{2}$/;
	const isValidPrice = priceRegex.test(stock.lastPrice.trim());
	const [priceError, setPriceError] = useState("");

	const volumeRegex = /^[0-9]+$/;
	const isValidVolume = volumeRegex.test(stock.volume.trim());
	const [volumeError, setVolumeError] = useState("");

	useEffect(() => {
		const getAllUsers = async () => {
			try {
				const response = await axios.get("/api/users/get-all", {
					withCredentials: true,
				});
				setUsers(response.data);
				console.log(response.data);
			} catch (err: any) {
				console.log(err);
				return [];
			}
		};

		const getAllStocks = async () => {
			try {
				const response = await axios.get("/api/stocks/all", {
					withCredentials: true,
				});
				setStocks(response.data);
				console.log(response.data);
			} catch (err: any) {
				console.log(err);
				return [];
			}
		};

		getAllUsers();
		getAllStocks();
	}, []);

	useEffect(() => {
		setPriceError(
			stock.lastPrice && !isValidPrice
				? "The price is not correctly formatted."
				: ""
		);
	}, [stock.lastPrice]);

	useEffect(() => {
		setVolumeError(
			stock.volume && !isValidVolume ? "The volume must be an integer." : ""
		);
	}, [stock.volume]);

	const handleClick = async (e: any) => {
		navigate("/register-admin");
	};

	const handleSubmit = async (e: any) => {
		try {
			await axios.post("/api/stocks/create", {
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

	const goToUserPortfolio = (user: any) => {
		navigate("/admin/manage-user", { state: { user } });
	}

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
					Register New Admin
				</Button>
			)}
			<Button
				onClick={() => navigate("/admin/bank-of-portugal")}
				variant="contained"
				sx={{ ml: 4, mt: 3, width: 200, height: 30 }}
			>
				Bank of Portugal
			</Button>
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
								<Stack
									sx={{ width: "100%" }}
									direction="row"
									spacing={1}
									alignItems="center"
								>
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
										error={stock.lastPrice.length > 0 && !isValidPrice}
										helperText={priceError}
									/>
									<Typography variant="h6">€</Typography>
								</Stack>
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
									error={stock.volume.length > 0 && !isValidVolume}
									helperText={volumeError}
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
										!stock.volume ||
										!isValidPrice ||
										!isValidVolume
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
								height: "100%",
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
												goToUserPortfolio(user);
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
								All stocks
							</Typography>
							<Table sx={{ minWidth: 650 }}>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>ISIN</TableCell>
										<TableCell>Exchange</TableCell>
										<TableCell>Last Price</TableCell>
										<TableCell>Volume</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{stocks.map((stock) => (
										<TableRow
											key={stock.id}
											sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
										>
											<TableCell>{stock.name}</TableCell>
											<TableCell>{stock.ISIN}</TableCell>
											<TableCell>{stock.exchange}</TableCell>
											<TableCell>{stock.lastPrice}</TableCell>
											<TableCell>{stock.volume}</TableCell>
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
