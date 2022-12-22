import {
	Box,
	Button,
	TextField,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../components/Transition";
import useAuth from "../hooks/useAuth";
import axios from "../interceptors/Axios";

function Login() {
	const { setAuth } = useAuth();

	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [firstTry, setFirstTry] = useState(true);
	const [firstSending, setFirstSending] = useState(false);
	const [secondSending, setSecondSending] = useState(false);
	const [error, setError] = useState(false);

	const [twoFA, setTwoFA] = useState(false);
	const [twoFAToken, setTwoFAToken] = useState("");

	const handleFirstSubmit = async (e: any) => {
		setFirstSending(true);
		setFirstTry(false);

		if (!email.length || !email.includes("@") || password.length < 4) {
			setFirstSending(false);
			return;
		}

		try {
			await axios.post("/api/auth/verify-login", {
				email: email,
				password: password,
			});

			setFirstTry(true);
			setTwoFA(true);
		} catch (err: any) {
			setError(true);
		}
	};

	const handleSecondSubmit = async (e: any) => {
		setSecondSending(true);

		try {
			const response = await axios.post("/api/auth/login", {
				email: email,
				password: password,
				token: twoFAToken,
			});

			const data = await response.data;

			setAuth({
				isLoggedIn: true,
				isAdmin: data.isAdmin,
				username: "",
				accessToken: data.accessToken,
			});

			navigate("/home");
		} catch (err: any) {
			setError(true);
		}

		setSecondSending(false);
		setTwoFA(false);
	};

	return (
		<>
			<Box sx={{ mx: "auto", width: "50vh" }}>
				<Typography variant="h4" component="h1">
					<strong>Login</strong>
				</Typography>
				{error && (
					<Typography fontSize={15} color="red">
						Failed To Login. Wrong credentials.
					</Typography>
				)}
				<Box component="form">
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
					<Box sx={{ textAlign: "right" }}>
						<Link to={"/forgot-password"}>Forgot password</Link>
					</Box>
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
						<Link to={"/register"}>New Account</Link>
					</Button>
				</Box>
			</Box>
			<Dialog
				open={twoFA}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setTwoFA(false)}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>{"Google Authenticator"}</DialogTitle>
				<DialogContent>
					<Box sx={{ mx: "auto", maxWidth: "50vh", maxHeight: "100vw" }}>
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
							onChange={(e) => setTwoFAToken(e.target.value)}
							error={!firstTry}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setTwoFA(false)}>Close</Button>
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

export default Login;
