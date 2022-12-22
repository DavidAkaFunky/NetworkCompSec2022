import {
	Box,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import TwoFADialog from "../components/TwoFADialog";
import axios from "../interceptors/Axios";

function Register() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [qrCode, setQrCode] = useState("");
	const [firstTryForm, setFirstTryForm] = useState(true);
	const [firstTryTwoFA, setFirstTryTwoFA] = useState(true);
	const [firstSending, setFirstSending] = useState(false);
	const [secondSending, setSecondSending] = useState(false);
	const [twoFA, setTwoFA] = useState(false);
	const [twoFAToken, setTwoFAToken] = useState("");
	const [error, setError] = useState(false);

	const secret = useRef("");

	const handleFirstSubmit = async (e: any) => {
		setFirstSending(true);
		setFirstTryForm(false);

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
            
			await axios.post("/api/auth/register-client", {
				name: name,
				email: email,
				password: password,
				secret: secret.current,
				token: twoFAToken,
			});

			navigate("/login");
		} catch (err: any) {
			setFirstTryTwoFA(false);
		} finally {
            setSecondSending(false);
            setTwoFA(false);
        }
	};

	return (
		<>
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
						error={!firstTryForm && name.length <= 0}
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
						error={!firstTryForm && password !== repeatPassword}
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
			<TwoFADialog qrCode={qrCode} twoFA={twoFA} setTwoFA={setTwoFA} twoFAToken={twoFAToken} setTwoFAToken={setTwoFAToken} sending={secondSending} setSending={setSecondSending} firstTry={firstTryTwoFA} handleSubmit={handleSecondSubmit} />
		</>
	);
}

export default Register;