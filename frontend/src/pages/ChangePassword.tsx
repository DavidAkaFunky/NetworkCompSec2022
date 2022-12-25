import {
	Box,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../interceptors/Axios";

function ChangePassword() {
	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [firstTry, setFirstTry] = useState(true);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState(false);

	const handleSubmit = async (e: any) => {
		setSending(true);
		setFirstTry(false);

		if (password.length < 4 ||
			repeatPassword !== password
		) {
			setSending(false);
			return;
		}

		try {
			await axios.post("/api/auth/change-password", {
				email: "placeholder@ncmb.com", // CHANGE TO GET E-MAIL FROM SESSION FOR EXAMPLE?
                password: password
			});

			setFirstTry(true);
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
                    Failed to change password.
                </Typography>
            )}
            <Box component="form">
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
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={sending}
                >
                    {sending ? "Sending..." : "Submit"}
                </Button>
            </Box>
        </Box>
	);
}

export default ChangePassword;