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
	const { auth, setAuth } = useAuth();

	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [qrCode, setQrCode] = useState("");
	const [firstTryForm, setFirstTryForm] = useState(true);
	const [firstTryTwoFA, setFirstTryTwoFA] = useState(true);
	const [firstSending, setFirstSending] = useState(false);
	const [secondSending, setSecondSending] = useState(false);
	const [error, setError] = useState(false);
	const [twoFA, setTwoFA] = useState(false);
	const [twoFAToken, setTwoFAToken] = useState("");

	const secret = useRef("");

	const handleFirstSubmit = async (e: any) => {
		setFirstSending(true);
		setFirstTryForm(false);

		if (!email.length || !email.includes("@") || password.length < 4) {
			setFirstSending(false);
			return;
		}

		try {
			const response = await axios.post("/api/auth/verify-login", {
				email: email,
				password: password,
			});

			const data = await response.data;
			secret.current = data.secret;

			setQrCode(data.qrCode);
			setTwoFA(true);
			setFirstTryForm(true);
		} catch (err: any) {
			setError(true);
		}
		
		setFirstSending(false);
	};

	const handleSecondSubmit = async (e: any) => {
		setSecondSending(true);

		try {
			if(!(Number(twoFAToken) && twoFAToken.length !== 6)){
				setFirstTryTwoFA(false);
                setSecondSending(false);
                return;
            }

			const response = await axios.post("/api/auth/login", {
				email: email,
				password: password,
				secret: secret.current,
				token: twoFAToken
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
			console.log(err);
			setError(true);
		} finally {
			setSecondSending(false);
			setTwoFA(false);
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
						Failed to login. Please check your credentials and try again.
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
						error={!firstTryForm && !(email.length > 1 && email.includes("@"))}
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
						error={!firstTryForm && password.length > 0 && password.length < 4}
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
			<TwoFADialog qrCode={qrCode} twoFA={twoFA} setTwoFA={setTwoFA} twoFAToken={twoFAToken} setTwoFAToken={setTwoFAToken} sending={secondSending} setSending= {setSecondSending} firstTry={firstTryTwoFA} handleSubmit={handleSecondSubmit} />
		</>
	);
}

export default Login;
