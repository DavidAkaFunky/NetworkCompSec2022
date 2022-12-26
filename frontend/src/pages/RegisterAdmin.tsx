import {
	Box,
	Button,
	TextField,
	Typography,
	Stack,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
} from "@mui/material";
import { useState } from "react";
import Transition from "../components/Transition";

import axios from "../interceptors/Axios";

function RegisterAdmin() {

	const [name, setName] = useState("");
	const [partialEmail, setPartialEmail] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [showCredentials, setShowCredentials] = useState(false);

	const [firstTry, setFirstTry] = useState(true);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState(false);

	const handleSubmit = async (e: any) => {
		setSending(true);
		setFirstTry(false);

		if ( !name.length || !partialEmail.length) {
			setSending(false);
			return;
		}

		try {
			setFirstTry(true);
			const response = await axios.post("/api/auth/register-admin", {
				name: name,
				partial_email: partialEmail
			});

			if(response.status == 200){
				setEmail(response.data.email)
				setPassword(response.data.password);
				setShowCredentials(true);
			} else {
				setError(true);
			}

		} catch (err: any) {
			setError(true);
		}

		setSending(false);
	};

	return (
		<>
			<Box sx={{ mx: "auto", width: "80vw", maxWidth: 500 }}>
				<Typography variant="h4" component="h1">
					<strong>Register New Admin</strong>
				</Typography>
				{error && (
					<Typography fontSize={15} color="red">
						Failed to register. Please try another email and try again.
					</Typography>
				)}
				<Box component="form">
					<TextField
						margin="normal"
						variant="filled"
						required
						fullWidth
						id="name"
						label={"Full name"}
						name="name"
						autoFocus
						value={name}
						onChange={(e) => setName(e.target.value)}
						error={!firstTry && name.length <= 0}
					/>
					<Stack sx={{width: "100%"}} direction="row" spacing={1}  alignItems="center">
						<TextField
							margin="normal"
							variant="filled"
							required
							fullWidth
							id="email"
							label={"Email Address"}
							name="email"
							autoFocus
							value={partialEmail}
							onChange={(e) => setPartialEmail(e.target.value)}
							error={!firstTry && partialEmail.length <= 0 }
						/>
						<Typography variant="h6" >
							@ncmb.pt
						</Typography>
					</Stack>
					
					<Button
						fullWidth
						onClick={handleSubmit}
						variant="contained"
						sx={{ mt: 3 }}
						disabled={sending}
					>
						{sending ? "Sending..." : "Submit"}
					</Button>
				</Box>
			</Box>
			<Dialog
				open={showCredentials}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => { setSending(false); setShowCredentials(false) }}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle fontSize={30}>{"New User Credentials"}</DialogTitle>
				<DialogContent>
					<Typography fontSize={15} color="red">
						This credentials are valid for 1 day. Please validate the account.
					</Typography>
					<Typography fontSize={15}>
						Email:   {email}
					</Typography>
					<Typography fontSize={15}>
						Password: {password}
					</Typography>
					
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowCredentials(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default RegisterAdmin;