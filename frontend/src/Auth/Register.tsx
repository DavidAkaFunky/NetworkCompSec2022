import { Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import { maxWidth } from "@mui/system";
import { auto } from "@popperjs/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TransitionProps } from '@mui/material/transitions';
import axios from "../Axios/Axios";
import React from "react";

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
	  children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
	) {
		return <Slide direction="up" ref={ref} {...props} />;
});

function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [secret, setSecret] = useState("");
	const [qrCode, setQrCode] = useState("");
	const [firstTry, setFirstTry] = useState(true);
	const [sending, setSending] = useState(false);
	const [twoFA, setTwoFA] = useState(false);
	const [twoFACode, setTwoFACode] = useState("");

	const handleNameChange = (e: any) => {
		setName(e.target.value);
	};

	const handleEmailChange = (e: any) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: any) => {
		setPassword(e.target.value);
	};

	const handleRepeatPasswordChange = (e: any) => {
		setRepeatPassword(e.target.value);
	};

	const handleTwoFACodeChange = (e: any) => {
		setTwoFACode(e.target.value);
	};

	const handleOpen = () => {
		setTwoFA(true);
	};

	const handleClose = () => {
		setTwoFA(false);
	};

	const handleFirstSubmit = async (e: any) => {
		setSending(true);
		setFirstTry(false);

		if (
			!name.length ||
			!email.length || !email.includes("@") ||
			password.length < 4 ||
			repeatPassword != password
		) {
			setSending(false); 
			return; 
		}

		const url = "/api/auth/check-register";

		const data = {
			email: email,
		};

		const response = await axios.post(url, data);

		setSending(false);

		if (response.status === 200) {
			const data = await response.data;
			// maybe change component to say succesful and button to go to login
			setFirstTry(true);
			setSecret(data.secret);
			setQrCode(data.qrCode);
			setTwoFA(true);
		}
	};

	const handleSecondSubmit = async (e: any) => {
		setSending(true);

		const url = "/api/auth/register";

		const data = {
			name: name,
			email: email,
			password: password,
			secret: secret,
		};

		const response = await axios.post(url, data);

		setSending(false);
	};

	return (
	<div>
		<Box sx={{ mx: "auto", width: "80vw", maxWidth: 500 }}>
			<Typography variant="h5" component="h1">
				<strong>Register</strong>
			</Typography>
			<Box component="form">
				<TextField
					margin="normal"
					variant="filled"
					required
					fullWidth
					id="name"
					label={"Full name"}
					name="name"
					autoComplete="name"
					autoFocus
					value={name}
					onChange={handleNameChange}
					error={!firstTry && name.length <= 0}
				/>
				<TextField
					margin="normal"
					variant="filled"
					required
					fullWidth
					id="email"
					label={"Email Address"}
					name="email"
					autoComplete="email"
					autoFocus
					value={email}
					onChange={handleEmailChange}
					error={!firstTry && !(email.length > 1 && email.includes("@"))}
				/>
				<TextField
					margin="normal"
					variant="filled"
					required
					fullWidth
					name="password"
					label={"Password"}
					type="password"
					id="password"
					autoComplete="current-password"
					value={password}
					onChange={handlePasswordChange}
					error={!firstTry && password.length < 4}
				/>
				<TextField
					margin="normal"
					variant="filled"
					required
					fullWidth
					name="repeatPassword"
					label={"Repeat Password"}
					type="password"
					id="repeatPassword"
					autoComplete="current-password"
					value={repeatPassword}
					onChange={handleRepeatPasswordChange}
					error={!firstTry && password !== repeatPassword}
				/>
				<Button
					fullWidth
					onClick={handleFirstSubmit}
					variant="contained"
					sx={{ mt: 3 }}
					disabled={ sending }
				>
					{sending ? "Sending..." : "Submit"}
				</Button>
				<Button color="primary" fullWidth sx={{ mt: 2 }}>
					<Link to="/login">Already have an account?</Link>
				</Button>
			</Box>
		</Box>
		<Dialog
			open={twoFA}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			aria-describedby="alert-dialog-slide-description"
		>
			<DialogTitle>{"Google Authenticator"}</DialogTitle>
			<DialogContent>
				<Box sx={{ mx: "auto", maxWidth: "50vh", maxHeight: "100vw" }}>
					<img src={qrCode}  width="100%" />
					<TextField
						fullWidth
						variant="filled"
						required
						name="twoFACode"
						label={"Insert Code"}
						type="password"
						id="twoFACode"
						autoComplete="current-password"
						value={twoFACode}
						onChange={handleTwoFACodeChange}
						error={	!firstTry  }
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Close</Button>
				<Button onClick={handleClose}>Send</Button>
			</DialogActions>
		</Dialog>
	</div>	
	);
}



export default Register;
