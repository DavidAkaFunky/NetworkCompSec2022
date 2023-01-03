import { Copyright } from "@mui/icons-material";
import {
	Button,
	Container,
	Grid,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import BuyOrSellDialog from "../components/BuyOrSellDialog";

interface TitleProps {
	children?: React.ReactNode;
}

function Title(props: TitleProps) {
	return (
		<Typography component="h2" variant="h6" color="primary" gutterBottom>
			{props.children}
		</Typography>
	);
}

function Home() {
	const [stocks, setStocks] = useState([]);
	const [sending, setSending] = useState(false);
	const [ISIN, setISIN] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const getStocks = async () => {
			try {
				const response = await axios.get("/api/stocks/all");
				setStocks(response.data);
			} catch (err: any) {
				setStocks([]);
				setError(err);
			}
		};

		getStocks();
	}, []);

	const handleBuyStock = async (e: any) => {
		setSending(true);

		try {
			const response = await axios.post("/api/stocks/buy", {
				ISIN,
			});
			console.log(response);
		} catch (err: any) {
			setError(err);
		} finally {
			setSending(false);
		}
	};

	const handleSellStock = async (e: any) => {
		setSending(true);

		try {
			const response = await axios.post("/api/stocks/sell", {
				ISIN,
			});
			console.log(response);
		} catch (err: any) {
			setError(err);
		} finally {
			setSending(false);
		}
	};

	return (
		<>
			<Typography component="h2" variant="h3" align="left">
				Home
			</Typography>
			{error && (
				<Typography fontSize={15} color="red">
					There was an error with your login: {error}
				</Typography>
			)}
			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<Grid container spacing={3}>
					{/* Chart */}
					<Grid item xs={12} md={8} lg={9}>
						<Paper
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
								height: 240,
							}}
						>
							<Title>Credit Card</Title>
						</Paper>
					</Grid>
					{/* Recent Deposits */}
					<Grid item xs={12} md={4} lg={3}>
						<Paper
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
								height: 240,
							}}
						>
							<Title>Mortgage & Loans</Title>
							<Typography component="p" variant="h4">
								$3,024.00
							</Typography>
							<Typography color="text.secondary" sx={{ flex: 1 }}>
								on 15 March, 2019
							</Typography>
							<div>
								<Link color="primary" href="#" onClick={() => {}}>
									View balance
								</Link>
							</div>
						</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
								height: 240,
							}}
						>
							<Title>Buy Stocks</Title>
						</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
								height: 240,
							}}
						>
							<Title>Sell Stocks</Title>
						</Paper>
					</Grid>
					{/* Recent Orders */}
					<Grid item xs={12}>
						<Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
							<Title>Recent Stock Transactions</Title>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>ISIN</TableCell>
										<TableCell>Exchange</TableCell>
										<TableCell>Last Price</TableCell>
										<TableCell>Volume</TableCell>
										<TableCell align="right">Date</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{stocks.map((stock) => (
										<TableRow key={stock["id"]}>
											<TableCell>{stock["name"]}</TableCell>
											<TableCell>{stock["ISIN"]}</TableCell>
											<TableCell>{stock["exchange"]}</TableCell>
											<TableCell>{`${stock["lastPrice"]} €`}</TableCell>
											<TableCell>{stock["volume"]}</TableCell>
											<TableCell align="right">{stock["date"]}</TableCell>
											<TableCell>
												<Button onClick={() => setISIN(stock["ISIN"])}>
													Buy
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<Link color="primary" href="#" onClick={() => {}} sx={{ mt: 3 }}>
								See more orders
							</Link>
						</Paper>
					</Grid>
				</Grid>
				<Copyright sx={{ pt: 4 }} />
			</Container>
			<BuyOrSellDialog
				ISIN={ISIN}
				setISIN={setISIN}
				buyOrSell="buy"
				sending={sending}
				setSending={setSending}
				handleSubmit={handleBuyStock}
			/>
			<BuyOrSellDialog
				ISIN={ISIN}
				setISIN={setISIN}
				buyOrSell="sell"
				sending={sending}
				setSending={setSending}
				handleSubmit={handleSellStock}
			/>
		</>
	);
}

export default Home;
