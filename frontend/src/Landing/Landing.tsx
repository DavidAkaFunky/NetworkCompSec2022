import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Grid,
	Stack,
	Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/StarBorder";

const tiers = [
	{
		title: "Loan",
		price: "7.49%",
		priceDescription: "/APR",
		description: [
			"From €3000 to €100000",
			"Fixed interest rate",
			"No origination fee",
			"Same-day credit decision",
		],
		buttonText: "Get started",
		buttonVariant: "outlined",
	},
	{
		title: "Credit Card",
		subheader: "Most popular",
		price: "€0",
		priceDescription: "/mo",
		description: [
			"1% cashback on all purchases",
			"Transfer money for free",
			"Free ATM withdrawals",
			"Unlimited foreign exchange",
		],
		buttonText: "Sign up for free",
		buttonVariant: "contained",
	},
	{
		title: "Mortgage",
		price: "4.85%",
		priceDescription: "/APR",
		description: [
			"Up to 70% of the house value",
			"Minimum of 7 years and maximum of 30 years",
			"Mixed or fixed interest rate",
		],
		buttonText: "Contact us",
		buttonVariant: "outlined",
	},
];

function Landing() {
	return (
		<>
			{/* Hero unit */}
			<Box
				sx={{
					bgcolor: "background.paper",
					pt: 8,
					pb: 6,
				}}
			>
				<Container maxWidth="sm">
					<Typography
						component="h1"
						variant="h2"
						align="center"
						color="text.primary"
						gutterBottom
					>
						Nova Caixa Milenar Bancária
					</Typography>
					<Typography
						variant="h5"
						align="center"
						color="text.secondary"
						paragraph
					>
						NCMB is a bank that operates in Portugal since 1900. 
						It has a large portfolio of clients, from individuals to small businesses, 
						and large multi-national organizations.
					</Typography>
				</Container>
				<Container maxWidth="md" component="main" sx={{mt: 5}}>
					<Grid container spacing={5} alignItems="flex-end">
						{tiers.map((tier) => (
							// Enterprise card is full width at sm breakpoint
							<Grid
								item
								key={tier.title}
								xs={12}
								sm={tier.title === "Enterprise" ? 12 : 6}
								md={4}
							>
								<Card>
									<CardHeader
										title={tier.title}
										subheader={tier.subheader}
										titleTypographyProps={{ align: "center" }}
										action={tier.title === "Pro" ? <StarIcon /> : null}
										subheaderTypographyProps={{
											align: "center",
										}}
										sx={{
											backgroundColor: (theme) =>
												theme.palette.mode === "light"
													? theme.palette.grey[200]
													: theme.palette.grey[700],
										}}
									/>
									<CardContent>
										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												alignItems: "baseline",
												mb: 2,
											}}
										>
											<Typography
												component="h2"
												variant="h3"
												color="text.primary"
											>
												{tier.price}
											</Typography>
											<Typography variant="h6" color="text.secondary">
												{tier.priceDescription}
											</Typography>
										</Box>
										<ul>
											{tier.description.map((line) => (
												<Typography
													component="li"
													variant="subtitle1"
													align="center"
													key={line}
												>
													{line}
												</Typography>
											))}
										</ul>
									</CardContent>
									<CardActions>
										<Button
											fullWidth
											variant={tier.buttonVariant as "outlined" | "contained"}
										>
											{tier.buttonText}
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		</>
	);
}

export default Landing;
