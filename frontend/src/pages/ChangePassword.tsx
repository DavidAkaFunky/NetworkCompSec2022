import {
	Box,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../interceptors/Axios";

function ChangePassword() {
	const navigate = useNavigate();

	const [currentPassword, setCurrentPassword] = useState("");

	const passwordRegex = /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-_+.]){1,}).{8,32}$/;
    const [newPassword, setNewPassword] = useState("");
	const [newPasswordError, setNewPasswordError] = useState("");
	const isValidNewPassword = passwordRegex.test(newPassword) && newPassword !== currentPassword;

	const [repeatNewPassword, setRepeatNewPassword] = useState("");
	const [repeatNewPasswordError, setRepeatNewPasswordError] = useState("");
	const isValidRepeatNewPassword = repeatNewPassword === newPassword;

	const [sending, setSending] = useState(false);
	const [generalError, setGeneralError] = useState("");

    useEffect(() => {
		setNewPasswordError(newPassword && !isValidNewPassword ? "The new password is invalid. It must not match your current password, be 8-32 characters long and have at least: an uppercase letter, a lowercase letter, a digit and one of these symbols: !@#$%^&*()\-_+." : "");
	}, [currentPassword, newPassword]);

	useEffect(() => {
		setRepeatNewPasswordError(repeatNewPassword && !isValidRepeatNewPassword ? "The passwords do not match." : "");
	}, [repeatNewPassword, newPassword]);

	const handleSubmit = async (e: any) => {
		setSending(true);

		if (!currentPassword || !newPassword || !repeatNewPassword || !isValidNewPassword || !isValidRepeatNewPassword ) {
			setSending(false);
			return;
		}

		try {
            await axios.patch("/api/auth/change-password", {
                oldPassword: currentPassword,
                newPassword: newPassword
			});

            navigate("/");
		} catch (err: any) {
			setGeneralError(err);
		} finally {
			setSending(false);
		}
	};


	return (
        <Box sx={{ mx: "auto", width: "80vw", maxWidth: 500 }}>
            <Typography variant="h4" component="h1">
                <strong>Change Password</strong>
            </Typography>
            {generalError && (
                <Typography fontSize={15} color="red">
                    Failed to change password: {generalError}
                </Typography>
            )}
            <Box component="form">
                <TextField
                    margin="normal"
                    variant="filled"
                    required
                    fullWidth
                    name="password"
                    label={"Current Password"}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                    margin="normal"
                    variant="filled"
                    required
                    fullWidth
                    name="password"
                    label={"New Password"}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={newPassword.length > 0 && !isValidNewPassword}
					helperText={newPasswordError}
                />
                <TextField
                    margin="normal"
                    variant="filled"
                    required
                    fullWidth
                    name="repeatNewPassword"
                    label={"Repeat Password"}
                    type="password"
                    id="repeatNewPassword"
                    autoComplete="current-password"
                    value={repeatNewPassword}
                    onChange={(e) => setRepeatNewPassword(e.target.value)}
                    error={repeatNewPassword.length > 0 && !isValidRepeatNewPassword}
					helperText={repeatNewPasswordError}
                />
                <Button
                    fullWidth
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={!currentPassword || !newPassword || !repeatNewPassword ||
                              !isValidNewPassword || !isValidRepeatNewPassword || sending}
                >
                    {sending ? "Sending..." : "Submit"}
                </Button>
            </Box>
        </Box>
	);
}

export default ChangePassword;