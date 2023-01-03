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
    const dummyLoan = {
        "loanAmount": 1000,
        "loanDuration": 12,
        "interestRate": 0.1,
        "description": ["Loan 1"],
        "bank": {
            "name": "Bank 1",
            "address": "Address 1",
            "phone": "32545261269",
            "email": ""
        }
    };

    const [loans, setloans] = useState([dummyLoan]); 
    const [error, setError] = useState(false);

    const getLoans = async () => { 
        
        try{
            const response = await axios.get("/api/loans", {
                withCredentials: true
            });
            if(response.data) {
                setloans(response.data);
            } else {
                setError(true);
            }      
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
				</Container>
				<Container maxWidth="md" component="main" sx={{ mt: 5 }}>
					<Grid container spacing={5} alignItems="flex-end">
						{loans.map((loan) => (
							// Enterprise card is full width at sm breakpoint
							<Grid
								item
								key={loan.loanAmount}
								xs={12}
								sm={6}
								md={4}
							>
								<Card>
									<CardHeader
										title={loan["loanAmount"]}
										subheader={loan["loanDuration"]}
										titleTypographyProps={{ align: "center" }}
										action={<StarIcon />}
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
												{loan["interestRate"]}
											</Typography>
											<Typography variant="h6" color="text.secondary">
												{loan["bank"]["name"]}
											</Typography>
										</Box>
										<ul>
											{loan["description"].map((line) => (
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
											variant={"outlined"}
										>
											{"Acquire"}
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

export default Loans;
