import {
	Box,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../interceptors/Axios";

function RegisterAdmin() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [firstTry, setFirstTry] = useState(true);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState(false);

	const handleFirstSubmit = async (e: any) => {
		setSending(true);
		setFirstTry(false);

		if (
			!name.length ||
			!email.length ||
			!email.includes("@") ||
			password.length < 4 ||
			repeatPassword !== password
		) {
			setSending(false);
			return;
		}

		try {
			setFirstTry(true);
			await axios.post("/api/auth/register-admin", {
				name: name,
				email: email,
				password: password
			});

			navigate("/login");
		} catch (err: any) {
			setError(true);
		}

		setSending(false);
	};

	return (
		<Box sx={{ mx: "auto", width: "80vw", maxWidth: 500 }}>
			<Typography variant="h4" component="h1">
				<strong>Register</strong>
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
					autoComplete="name"
					autoFocus
					value={name}
					onChange={(e) => setName(e.target.value)}
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
					onChange={(e) => setEmail(e.target.value)}
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
					onChange={(e) => setPassword(e.target.value)}
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
					onChange={(e) => setRepeatPassword(e.target.value)}
					error={!firstTry && password !== repeatPassword}
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

export default RegisterAdmin;