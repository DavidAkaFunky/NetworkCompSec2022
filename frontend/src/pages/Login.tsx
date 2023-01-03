import {
	Box,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import TwoFADialog from "../components/TwoFADialog";
import axios from "../interceptors/Axios";

function Login() {
	const { setAuth } = useAuth();

	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	
	const [firstSending, setFirstSending] = useState(false);
	const [secondSending, setSecondSending] = useState(false);
	
	const [error, setError] = useState("");
	
	const [qrCode, setQrCode] = useState("");
	const [twoFA, setTwoFA] = useState(false);
	const [twoFAToken, setTwoFAToken] = useState("");

	const secret = useRef("");

	const handleFirstSubmit = async (e: any) => {
		setFirstSending(true);
		setQrCode("");
		secret.current = "";

		if (!email || !password) {
			setFirstSending(false);
			return;
		}
		try {
			const response = await axios.post("/api/auth/first-stage-login", {
				email: email,
				password: password,
			});

			if (response.data){
				secret.current = response.data.secret;
				setQrCode(response.data.qrCode);
			}
			setTwoFA(true);

		} catch (err: any) {
			setError(err);
		} finally {
			setFirstSending(false);
		}
	};

	const handleSecondSubmit = async (e: any) => {
		setSecondSending(true);

		try {
			if (!(Number(twoFAToken) && twoFAToken.length === 6)){
                setSecondSending(false);
                return;
            }

			const response = await axios.post("/api/auth/second-stage-login", {
				email: email,
				password: password,
				secret: secret.current,
				token: twoFAToken
			});

			setAuth({
				isLoggedIn: true,
				role: response.data.role,
				username: response.data.name,
				accessToken: response.data.accessToken,
			});
			navigate("/home");

		} catch (err: any) {
			setError(err);
		} finally {
			setSecondSending(false);
			setTwoFA(false);
			setTwoFAToken("");
		}
	};

	return (
		<>
			<Box sx={{ mx: "auto", width: "50vh" }}>
				<Typography variant="h4" component="h1">
					<strong>Login</strong>
				</Typography>
				{error && (
					<Typography fontSize={15} color="red">
						There was an error with your login: {error}
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
					/>
					<Box sx={{ textAlign: "right" }}>
						<Link to={"/forgot-password"}>Forgot password</Link>
					</Box>
					<Button
						fullWidth
						onClick={handleFirstSubmit}
						variant="contained"
						sx={{ mt: 3 }}
						disabled={!email || !password || firstSending}
					>
						{firstSending ? "Sending..." : "Submit"}
					</Button>
					<Button color="primary" fullWidth sx={{ mt: 2 }}>
						<Link to={"/register"}>New Account</Link>
					</Button>
				</Box>
			</Box>
			<TwoFADialog
				qrCode={qrCode}
				twoFA={twoFA}
				setTwoFA={setTwoFA}
				token={twoFAToken}
				setToken={setTwoFAToken}
				sending={secondSending}
				setSending={setSecondSending}
				handleSubmit={handleSecondSubmit}
			/>
		</>
	);
}

export default Login;
