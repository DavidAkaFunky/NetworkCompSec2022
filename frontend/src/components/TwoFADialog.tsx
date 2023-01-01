import {
	Box,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useState, useEffect } from "react";
import Transition from "../components/Transition";

type TwoFADialogProps = {
    qrCode?: string,
    twoFA: boolean,
    setTwoFA: React.Dispatch<React.SetStateAction<boolean>> 
    token: string,
    setToken: React.Dispatch<React.SetStateAction<string>>, 
    sending: boolean,
    setSending: React.Dispatch<React.SetStateAction<boolean>>,
    handleSubmit: (e: any) => Promise<void>
}

const TwoFADialog = ({ qrCode, twoFA, setTwoFA, token, setToken, sending, setSending, handleSubmit }: TwoFADialogProps) => {

    const tokenRegex = /^[0-9]{6}$/;
	const isValidToken = tokenRegex.test(token);
	const [tokenError, setTokenError] = useState("");
    
    useEffect(() => {
        setTokenError(token && !isValidToken ? "The name must be at least 4 characters long." : "");
	}, [token, tokenError]);

    return (
        <Dialog
            open={twoFA}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => { setSending(false); setTwoFA(false) }}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Two-Factor Authentication"}</DialogTitle>
            <DialogContent>
                <Box sx={{ mx: "auto", maxWidth: "50vh", maxHeight: "100vw" }}>
                    {qrCode && <img src={qrCode} alt="" width="100%" />}
                    <TextField
                        fullWidth
                        variant="filled"
                        required
                        name="token"
                        label={"Insert Code"}
                        id="token"
                        autoComplete="current-password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        error={token.length > 0 && !isValidToken}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setTwoFA(false)}>Close</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={token.length <= 0 || !isValidToken || sending}
                >
                    {sending ? "Sending..." : "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TwoFADialog;