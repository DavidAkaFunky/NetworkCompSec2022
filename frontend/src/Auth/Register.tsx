import { Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle,} from "@mui/material";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../Components/Components";
import axios from "../Axios/Axios";

function Register() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [qrCode, setQrCode] = useState("");
	const [firstTry, setFirstTry] = useState(true);
	const [firstSending, setFirstSending] = useState(false);
	const [secondSending, setSecondSending] = useState(false);
	const [twoFA, setTwoFA] = useState(false);
	const [twoFAToken, setTwoFAToken] = useState("");
	const secret = useRef("");

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
		setTwoFAToken(e.target.value);
	};

	const handleClose = () => {
		setTwoFA(false);
	};

	const handleFirstSubmit = async (e: any) => {
		setFirstSending(true);
		setFirstTry(false);

		if (
			!name.length ||
			!email.length || !email.includes("@") ||
			password.length < 4 ||
			repeatPassword != password
		) {
			setFirstSending(false);
			return;
		}

		const url = "/api/auth/totp/generate";

		const data = {
			email: email,
		};

		const response = await axios.post(url, data);

		setFirstSending(false);

		if (response.status === 200) {
			const data = await response.data;
			// maybe change component to say succesful and button to go to login
			secret.current = data.secret;
			setQrCode(data.qrCode);
			setTwoFA(true);
			setFirstTry(true);
		}
	};

	const handleSecondSubmit = async (e: any) => {
		setSecondSending(true);

		let url = "/api/auth/totp/verify-register";

		let twoFAData = {
			token: twoFAToken,
			secret: secret.current,
		};

		let response = await axios.post(url, twoFAData);

		if(!response.data.result){
			// ERROR: Add to frontend!
			setSecondSending(false);
			return;
		}

		url = "/api/auth/register";

		const registerData = {
			name: name,
			email: email,
			password: password,
			secret: secret.current,
		};
		
		response = await axios.post(url, registerData);
		setSecondSending(false);
		setTwoFA(false);
		navigate("/");
	};

	return (
		<>
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
						error={!firstTry && password.length > 0 && password.length < 4}
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
						disabled={firstSending}
					>
						{firstSending ? "Sending..." : "Submit"}
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
						<img src={qrCode} width="100%" />
						<TextField
							fullWidth
							variant="filled"
							required
							name="twoFAToken"
							label={"Insert Code"}
							type="password"
							id="twoFAToken"
							autoComplete="current-password"
							value={twoFAToken}
							onChange={handleTwoFACodeChange}
							error={!firstTry}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
					<Button
						onClick={handleSecondSubmit}
						variant="contained"
						disabled={secondSending}
					>
						{secondSending ? "Sending..." : "Submit"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default Register;