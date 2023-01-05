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
import axios from "axios";
import { useState, useEffect } from "react";
import BuyOrSellDialog from "../components/BuyOrSellDialog";
import Title from "../components/Title";
import StockTable from "../components/StockTable";

function Home() {
	const [stocks, setStocks] = useState([]);
	const [ownedStocks, setOwnedStocks] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [sending, setSending] = useState(false);
	const [buyISIN, setBuyISIN] = useState("");
	const [sellISIN, setSellISIN] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const getStocks = async () => {
			try {
				const response = await axios.get("/api/stocks/all");
				setStocks(response.data);
			} catch (err: any) {
				setStocks([]);
				console.log(err);
				setError(err);
			}
		};

		const getTransactions = async () => {
			try {
				const response = await axios.get("/api/stocks/transactions/user");

				let ownedStocksIDs: { [index: number]: number } = {};
				response.data.forEach((stock: any) => {
					const id = stock.stock.id as number;
					stock.type === "BUY"
						? ownedStocksIDs[id]
							? ownedStocksIDs[id]++
							: (ownedStocksIDs[id] = 1)
						: ownedStocksIDs[id]
							? ownedStocksIDs[id]--
							: (ownedStocksIDs[id] = -1);
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
		getTransactions();
	}, [sending]);

	const handleBuyStock = async (e: any) => {
		setSending(true);
		try {
			await axios.post("/api/stocks/buy/user", {
				ISIN: buyISIN,
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
			await axios.post("/api/stocks/sell/user", {
				ISIN: sellISIN,
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
				Home
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

export default Home;
