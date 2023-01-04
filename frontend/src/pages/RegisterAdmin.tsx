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
import { useState , useEffect } from "react";
import Transition from "../components/Transition";

import axios from "../interceptors/Axios";

function RegisterAdmin() {

	const nameRegex = /^[a-zA-Z]([a-zA-Z ]){3,}$/;
	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");
	const isValidName = nameRegex.test(name.trim());

	const partialEmailRegex = /^([a-zA-Z0-9\.\-_]){4,60}$/;
	const [partialEmail, setPartialEmail] = useState("");
	const [partialEmailError, setPartialEmailError] = useState("");
	const isValidPartialEmail = partialEmailRegex.test(partialEmail.trim());

	const [password, setPassword] = useState("");

	const [showCredentials, setShowCredentials] = useState(false);

	const [sending, setSending] = useState(false);
	const [generalError, setGeneralError] = useState("");

	useEffect(() => {
		setNameError(name && !isValidName ? "The name must be at least 4 characters long." : "");
	}, [name]);

	useEffect(() => {
		setPartialEmailError(partialEmail && !isValidPartialEmail ? "The email is invalid." : "");
	}, [partialEmail]);

	const handleSubmit = async (e: any) => {
		setSending(true);

		if (!name || !partialEmail || !isValidName || !isValidPartialEmail) {
			setSending(false);
			return;
		}

		try {
			const response = await axios.post("/api/auth/register-admin", {
				name: name,
				partialEmail: partialEmail
			});

			setPassword(response.data.password);
			setShowCredentials(true);

		} catch (err: any) {
			setGeneralError(err);
		} finally {
			setSending(false);
		}
	};

	return (
		<>
			<Box sx={{ mx: "auto", width: "80vw", maxWidth: 500 }}>
				<Typography variant="h4" component="h1">
					<strong>Register New Admin</strong>
				</Typography>
				{generalError && (
					<Typography fontSize={15} color="red">
						There was an error with your register: {generalError}
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
						error={name.length > 0 && !isValidName}
						helperText={nameError}
					/>
					<Stack sx={{width: "100%"}} direction="row" spacing={1} alignItems="center">
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
							error={partialEmail.length > 0 && !isValidPartialEmail}
							helperText={partialEmailError}
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
						disabled={!name || !partialEmail || !isValidName || !isValidPartialEmail || sending}
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
						Give these credentials to your new administrator.
					</Typography>
					<Typography fontSize={15}>
						Email:    {partialEmail + "@ncmb.pt"}
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