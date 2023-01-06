import {
	Box,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TwoFADialog from "../components/TwoFADialog";
import axios from "../interceptors/Axios";

function Register() {
	const navigate = useNavigate();

	const nameRegex = /^[a-zA-Z]([a-zA-Z ]){3,}$/;
	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");
	const isValidName = nameRegex.test(name.trim());

	const emailRegex = /^([a-zA-Z0-9\.\-_]){4,60}@([a-zA-Z\.\-_]){1,30}.([a-zA-Z]){1,4}$/;
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const isValidEmail = emailRegex.test(email.trim());

	const passwordRegex = /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-_+.]){1,}).{8,32}$/;
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const isValidPassword = passwordRegex.test(password);

	const [repeatPassword, setRepeatPassword] = useState("");
	const [repeatPasswordError, setRepeatPasswordError] = useState("");
	const isValidRepeatPassword = repeatPassword === password;
	
	const [firstSending, setFirstSending] = useState(false);
	const [secondSending, setSecondSending] = useState(false);
	
	const [qrCode, setQrCode] = useState("");

	const tokenRegex = /^[0-9]{6}$/;
	const [twoFA, setTwoFA] = useState(false);
	const [twoFAToken, setTwoFAToken] = useState("");
	const isValidToken = tokenRegex.test(twoFAToken);
	
	const [generalError, setGeneralError] = useState("");

	const secret = useRef("");

	useEffect(() => {
		setNameError(name && !isValidName ? "The name must be at least 4 characters long." : "");
	}, [name]);

	useEffect(() => {
		setEmailError(email && !isValidEmail ? "The email is invalid." : "");
	}, [email]);

	useEffect(() => {
		setPasswordError(password && !isValidPassword ? "The password is invalid. It must be 8-32 characters long and have at least: an uppercase letter, a lowercase letter, a digit and one of these symbols: !@#$%^&*()-_+." : "");
	}, [password]);

	useEffect(() => {
		setRepeatPasswordError(repeatPassword && !isValidRepeatPassword ? "The passwords do not match." : "");
	}, [repeatPassword, password]);

	const handleFirstSubmit = async (e: any) => {
		setFirstSending(true);

		if (!name || !email || !password || !repeatPassword ||
			!isValidName || !isValidEmail || !isValidPassword || !isValidRepeatPassword) {
			setFirstSending(false);
			return;
		}

		try {
			const response = await axios.post("/api/auth/totp/generate", {
				email: email,
			});

			secret.current = response.data.secret;
			setQrCode(response.data.qrCode);
			setTwoFA(true);

		} catch (err: any) {
			setGeneralError(err);
		} finally {
			setFirstSending(false);
		}

	};

	const handleSecondSubmit = async (e: any) => {
		setSecondSending(true);

		try {
            if (!isValidToken){
                setSecondSending(false);
                return;
            }

			await axios.post("/api/auth/register-client", {
				name: name,
				email: email,
				password: password,
				secret: secret.current,
				token: twoFAToken,
			});

			navigate("/login");
			
		} catch (err: any) {
			setGeneralError(err);
		} finally {
            setSecondSending(false);
			setTwoFAToken("");
            setTwoFA(false);
        }
	};

	return (
		<>
			<Box sx={{ mx: "auto", width: "80vw", maxWidth: 500 }}>
				<Typography variant="h4" component="h1">
					<strong>Register</strong>
				</Typography>
                {generalError && (
					<Typography fontSize={15} color="red">
						There was an error with your register: {generalError}
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
						error={name.length > 0 && !isValidName}
						helperText={nameError}
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
						error={email.length > 0 && !isValidEmail}
						helperText={emailError}
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
						error={password.length > 0 && !isValidPassword}
						helperText={passwordError}
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
						error={repeatPassword.length > 0 && !isValidRepeatPassword}
						helperText={repeatPasswordError}
					/>
					<Button
						fullWidth
						onClick={handleFirstSubmit}
						variant="contained"
						sx={{ mt: 3 }}
						disabled={!name || !email || !password || !repeatPassword ||
								  !isValidName || !isValidEmail || !isValidPassword || !isValidRepeatPassword || firstSending}
					>
						{firstSending ? "Sending..." : "Submit"}
					</Button>
					<Button
						color="primary"
						fullWidth sx={{ mt: 2 }}
					>
						<Link to="/login">Already have an account?</Link>
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

export default Register;