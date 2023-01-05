import { Copyright } from "@mui/icons-material";
import {
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
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BuyOrSellDialog from "../components/BuyOrSellDialog";
import StockTable from "../components/StockTable";
import axios from "../interceptors/Axios";

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

function ManageUser() {
	const { state } = useLocation();

	const [stocks, setStocks] = useState([]);
	const [ownedStocks, setOwnedStocks] = useState([]);
	const [transactions, setTransactions] = useState([]);

	const [buyISIN, setBuyISIN] = useState("");
	const [sellISIN, setSellISIN] = useState("");

	const [error, setError] = useState("");
	const [sending, setSending] = useState(false);

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

		const getUserTransactions = async () => {
			try {
				const response = await axios.post("/api/stocks/transactions/admin", {
					userEmail: state.user.email
				});

				let ownedStocksIDs: { [index: number]: number } = {};
				response.data.forEach((stock: any) => {
					const id = stock.stock.id as number;
					if (stock.type === "BUY") {
						if (ownedStocksIDs[id]) {
							ownedStocksIDs[id]++;
						} else {
							ownedStocksIDs[id] = 1;
						}
					} else {
						if (ownedStocksIDs[id]) {
							ownedStocksIDs[id]--;
						} else {
							ownedStocksIDs[id] = -1;
						}
					}
				});

				const ownedStocks = response.data
					.filter(
						(value: any, index: any, self: any) =>
							ownedStocksIDs[value.stock.id] &&
							index ===
								self.findIndex((t: any) => t.stock.id === value.stock.id)
					)
					.map((t: any) => t.stock);

				setTransactions(response.data);
				setOwnedStocks(ownedStocks);
			} catch (err: any) {
				setTransactions([]);
				setError(err);
			}
		};

		if (sending) return;
		getStocks();
		getUserTransactions();
	}, [sending]);

	const handleBuyStock = async (e: any) => {
		setSending(true);
		try {
			await axios.post("/api/stocks/buy/admin", {
				ISIN: buyISIN,
				userEmail: state.user.email
			});
		} catch (err: any) {
			setError(err);
		} finally {
			setBuyISIN("");
			setSending(false);
		}
	};

	const handleSellStock = async (e: any) => {
		setSending(true);

		try {
			await axios.post("/api/stocks/sell/admin", {
				ISIN: sellISIN,
				userEmail: state.user.email
			});
		} catch (err: any) {
			setError(err);
		} finally {
			setSellISIN("");
			setSending(false);
		}
	};

	return (
		<>
			<Typography component="h2" variant="h3" align="left">
				{state.user.name}'s Portfolio
			</Typography>
			{error && (
				<Typography fontSize={15} color="red">
					There was an error: {error}
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
								height: 300,
							}}
						>
							<Title>Credit Card</Title>
							<img
								style={{ display: "block", maxHeight: "100%" }}
								src="/Cx-Classic-Visa_480x380.png"
								alt="card"
							/>
						</Paper>
					</Grid>
					{/* Recent Deposits */}
					<Grid item xs={12} md={4} lg={3}>
						<Paper
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
								height: 300,
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
						<StockTable setISIN={setBuyISIN} info="Buy" stocks={stocks} />
					</Grid>
					<Grid item xs={6}>
						<StockTable
							setISIN={setSellISIN}
							info="Sell"
							stocks={ownedStocks}
						/>
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
										<TableCell>Price</TableCell>
										<TableCell>Type</TableCell>
										<TableCell>Date</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{transactions.map((transaction) => (
										<TableRow key={transaction["id"]}>
											<TableCell>{transaction["stock"]["name"]}</TableCell>
											<TableCell>{transaction["stock"]["ISIN"]}</TableCell>
											<TableCell>{transaction["stock"]["exchange"]}</TableCell>
											<TableCell>{`${transaction["price"]} €`}</TableCell>
											<TableCell>{transaction["type"]}</TableCell>
											<TableCell>
												{new Date(transaction["createdAt"]).toLocaleString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Paper>
					</Grid>
				</Grid>
				<Copyright sx={{ pt: 4 }} />
			</Container>
			<BuyOrSellDialog
				ISIN={buyISIN}
				setISIN={setBuyISIN}
				buyOrSell="buy"
				sending={sending}
				setSending={setSending}
				handleSubmit={handleBuyStock}
			/>
			<BuyOrSellDialog
				ISIN={sellISIN}
				setISIN={setSellISIN}
				buyOrSell="sell"
				sending={sending}
				setSending={setSending}
				handleSubmit={handleSellStock}
			/>
		</>
	);
}

export default ManageUser;
