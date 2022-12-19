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
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../components/Transition";
import axios from "../interceptors/Axios";

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

	const handleFirstSubmit = async (e: any) => {
		setFirstSending(true);
		setFirstTry(false);

		if (
			!name.length ||
			!email.length ||
			!email.includes("@") ||
			password.length < 4 ||
			repeatPassword !== password
		) {
			setFirstSending(false);
			return;
		}

		try {
			const response = await axios.post("/api/auth/totp/generate", {
				email: email,
			});

			const data = await response.data;
			secret.current = data.secret;

			setQrCode(data.qrCode);
			setTwoFA(true);
			setFirstTry(true);
		} catch (err: any) {
			// TODO
		}

		setFirstSending(false);
	};

	const handleSecondSubmit = async (e: any) => {
		setSecondSending(true);

		try {
			await axios.post("/api/auth/register", {
				name: name,
				email: email,
				password: password,
				secret: secret.current,
				token: twoFAToken,
			});

			setSecondSending(false);
			setTwoFA(false);

			navigate("/login");
		} catch (err: any) {
			// TODO
		}
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
				onClose={() => setTwoFA(false)}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>{"Google Authenticator"}</DialogTitle>
				<DialogContent>
					<Box sx={{ mx: "auto", maxWidth: "50vh", maxHeight: "100vw" }}>
						<img src={qrCode} alt="" width="100%" />
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

export default Register;
