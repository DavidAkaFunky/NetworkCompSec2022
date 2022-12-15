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

function createStockTransaction(
	id: number,
	name: string,
	ISIN: string,
	exchange: string,
	lastPrice: number,
	volume: number,
	date: string
) {
	return { id, name, ISIN, exchange, lastPrice, volume, date };
}

const rows = [
	createStockTransaction(
		0,
		"Galp",
		"PTGALP0AM000",
		"Euronext Lisbon",
		12.5,
		100,
		"2021-06-01"
	),
];

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
	return (
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
								{rows.map((row) => (
									<TableRow key={row.id}>
										<TableCell>{row.name}</TableCell>
										<TableCell>{row.ISIN}</TableCell>
										<TableCell>{row.exchange}</TableCell>
										<TableCell>{`€${row.lastPrice}`}</TableCell>
										<TableCell>{row.volume}</TableCell>
										<TableCell align="right">{row.date}</TableCell>
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
	);
}

export default Home;
