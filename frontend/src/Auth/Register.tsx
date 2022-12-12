import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../Axios/Axios";

function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [missing, setMissing] = useState(false);
	const [sending, setSending] = useState(false);

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

	const handleSubmit = async (e: any) => {
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

		const url = "http://localhost:3001/api/auth/register";

		const data = {
			name: name,
			email: email,
			password: password,
		};

		const response = await axios.post(url, data);

		if (response.status === 200) {
			// maybe change component to say succesful and button to go to login
			setSending(false);
		}
	};

	return (
		<Box sx={{ mx: "auto", width: "50vh" }}>
			<Typography variant="h5" component="h1">
				<strong>Login</strong>
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
					onClick={handleSubmit}
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

export default Register;
