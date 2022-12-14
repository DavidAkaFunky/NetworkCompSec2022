import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../Axios/Axios";
import { UserContext } from "../UserContext/UserContext";
import { UserContextType } from "../UserContext/UserContextType";

function Login() {

	const { setUser } = useContext(UserContext) as UserContextType;

	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [missing, setMissing] = useState(false);

	const handleEmailChange = (e: any) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e: any) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async (e: any) => {
		if (!email.length || !password.length) {
			setMissing(true);
			return;
		}
		setMissing(false);

		const url = "/api/auth/login";

		const data = {
			email: email,
			password: password,
		}

		const response = await axios.post(url, data);

		if (response.status === 200) {
			const data = await response.data;
			setUser({
				isLoggedIn: true,
				isAdmin: data.isAdmin,
			});
			sessionStorage.setItem("accessToken", data.accessToken);
			navigate("/home");
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
				<Box sx={{ textAlign: "right" }}>
					<Link to={"/forgot-password"}>
						Forgot password
					</Link>
				</Box>
				<Button
					fullWidth
					onClick={handleSubmit}
					variant="contained"
					sx={{ mt: 3 }}
				>
					Submit
				</Button>
				<Button color="primary" fullWidth sx={{ mt: 2 }}>
					<Link to={"/register"}>
						New Account
					</Link>
				</Button>
			</Box>
		</Box>
	);
}

export default Login;
