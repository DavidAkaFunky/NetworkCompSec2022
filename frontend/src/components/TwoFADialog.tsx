import {
	Box,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import Transition from "../components/Transition";

type TwoFADialogProps = {
    qrCode?: string,
    twoFA: boolean,
    setTwoFA: React.Dispatch<React.SetStateAction<boolean>> 
    twoFAToken: string,
    setTwoFAToken: React.Dispatch<React.SetStateAction<string>>, 
    sending: boolean,
    setSending: React.Dispatch<React.SetStateAction<boolean>>,
    firstTry: boolean,
    handleSubmit: (e: any) => Promise<void>
}

const TwoFADialog = ({ qrCode, twoFA, setTwoFA, twoFAToken, setTwoFAToken, sending, setSending, firstTry, handleSubmit }: TwoFADialogProps) => {
	return (
    <Dialog
        open={twoFA}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => { setSending(false); setTwoFA(false) }}
        aria-describedby="alert-dialog-slide-description"
    >
        <DialogTitle>{"Google Authenticator"}</DialogTitle>
        <DialogContent>
            <Box sx={{ mx: "auto", maxWidth: "50vh", maxHeight: "100vw" }}>
                {qrCode && <img src={qrCode} alt="" width="100%" />}
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
                    error={!firstTry && !(Number(twoFAToken) || twoFAToken.length !== 6)}
                />
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setTwoFA(false)}>Close</Button>
            <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={sending}
            >
                {sending ? "Sending..." : "Submit"}
            </Button>
        </DialogActions>
    </Dialog>);
};

export default TwoFADialog;