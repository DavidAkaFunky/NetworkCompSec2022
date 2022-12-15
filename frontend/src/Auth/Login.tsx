import { Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../Components/Components";
import axios from "../Axios/Axios";
import { UserContext } from "../UserContext/UserContext";
import { UserContextType } from "../UserContext/UserContextType";

function Login() {

	const { setUser } = useContext(UserContext) as UserContextType;

	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstTry, setFirstTry] = useState(true);
	const [firstSending, setFirstSending] = useState(false);
	const [secondSending, setSecondSending] = useState(false);
	const [twoFA, setTwoFA] = useState(false);
	const [twoFAToken, setTwoFAToken] = useState("");

	const handleEmailChange = (e: any) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: any) => {
		setPassword(e.target.value);
	};

	const handleFirstSubmit = async (e: any) => {
		setFirstSending(true);
		setFirstTry(false);

		if (!email.length || !email.includes("@") || password.length < 4){
			setFirstSending(false);
			return;
		}

		const url = "/api/auth/verify-login";

		const data = {
			email: email,
			password: password,
		}

		const response = await axios.post(url, data);

		if (response.status === 200) {
			setFirstTry(true);
			setTwoFA(true);
		}
	};

	const handleSecondSubmit = async (e: any) => {

		setSecondSending(true);

		const url = "/api/auth/login";

		const loginData = {
			email: email,
			token: twoFAToken
		};

		const response = await axios.post(url, loginData);

		if (response.status === 200) {
			const data = await response.data;
			setUser({
				isLoggedIn: true,
				isAdmin: data.isAdmin,
				username: "",//change in UserContext.tsx this to data.username
			});
			sessionStorage.setItem("accessToken", data.accessToken);
			navigate("/home");
		}
		
		setSecondSending(false);
		setTwoFA(false);
	};

	const handleTwoFACodeChange = (e: any) => {
		setTwoFAToken(e.target.value);
	};

	const handleClose = () => {
		setTwoFA(false);
	};

	return (
		<>
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
					<Box sx={{ textAlign: "right" }}>
						<Link to={"/forgot-password"}>
							Forgot password
						</Link>
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
						<Link to={"/register"}>
							New Account
						</Link>
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

export default Login;
