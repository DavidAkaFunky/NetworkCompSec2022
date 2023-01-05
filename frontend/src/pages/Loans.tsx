import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Grid,
	Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/StarBorder";
import { useState, useEffect } from "react";
import axios from "../interceptors/Axios";

function Loans() {

    const [loans, setLoans] = useState([]); 
    const [error, setError] = useState(false);

    const getLoans = async () => { 
        
        try{
            const response = await axios.get("/api/loans/all");
			console.log(response.data);
            setLoans(response.data);   
        } catch (err: any) {
			setError(err);
		}
    }

    useEffect(() => {
        getLoans();
    }, []);

	return (
		<>
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
						Loans
					</Typography>
					{error && (
						<Typography fontSize={15} color="red">
							There was an error: {error}
						</Typography>
					)}
				</Container>
				<Container maxWidth="md" component="main" sx={{ mt: 5 }}>
					<Grid container spacing={5} alignItems="flex-end">
						{loans.map((loan) => (
							// Enterprise card is full width at sm breakpoint
							<Grid
								item
								key={loan["loanAmount"]}
								xs={12}
								sm={6}
								md={4}
							>
								<Card>
									<CardHeader
										title={loan["loanAmount"] + " €"}
										subheader={loan["loanDuration"] + " months"}
										titleTypographyProps={{ align: "center" }}
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
												sx={{ mr: 1 }}
											>
												{loan["interestRate"] + "%"}
											</Typography>
											<Typography variant="h6" color="text.secondary">
												{loan["bank"]["name"]}
											</Typography>
										</Box>
										<ul>
											{(loan["description"] as never[]).map((line: any) => (
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
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		</>
	);
}

export default Loans;
