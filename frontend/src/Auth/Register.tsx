import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../Axios/Axios";

function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [secret, setSecret] = useState("");
	const [qrCode, setQrCode] = useState("");
	const [missing, setMissing] = useState(false);
	const [sending, setSending] = useState(false);
	const [twoFA, setTwoFA] = useState(false);

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

	const handleFirstSubmit = async (e: any) => {
		if (
			!name.length ||
			!email.length ||
			!password.length ||
			!repeatPassword.length
		) {
			setMissing(true);
			return;
		}
		setMissing(false);
		setSending(true);

		const url = "/api/auth/check-register";

		const data = {
			email: email,
		};

		const response = await axios.post(url, data);

		setSending(false);

		if (response.status === 200) {
			const data = await response.data;
			// maybe change component to say succesful and button to go to login
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

	if (!twoFA) {
		return (
			<Box sx={{ mx: "auto", width: "50vh" }}>
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
						error={missing}
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
						error={missing || (email.length > 0 && !email.includes("@"))}
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
						error={missing || (password.length > 0 && password.length < 4)}
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
						error={missing || password !== repeatPassword}
					/>
					<Button
						fullWidth
						onClick={handleFirstSubmit}
						variant="contained"
						sx={{ mt: 3 }}
						disabled={sending}
					>
						{sending ? "Sending..." : "Submit"}
					</Button>
					<Button color="primary" fullWidth sx={{ mt: 2 }}>
						<Link to="/login">Already have an account?</Link>
					</Button>
				</Box>
			</Box>
		);
	}
	return <div>It's dangerous to go alone, take this: <img src={qrCode}/>Scan this code, it's very safe!</div>;
}

export default Register;
