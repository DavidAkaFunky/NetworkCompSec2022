import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import Transition from "../components/Transition";

type BuyOrSellDialogProps = {
    ISIN: string,
    setISIN: React.Dispatch<React.SetStateAction<string>> 
    buyOrSell: string,
    sending: boolean,
    setSending: React.Dispatch<React.SetStateAction<boolean>>,
    handleSubmit: (e: any) => Promise<void>
}

const BuyOrSellDialog = ({ ISIN, setISIN, buyOrSell, sending, setSending, handleSubmit }: BuyOrSellDialogProps) => {

    return (
        <Dialog
            open={ISIN !== ""}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => {
                setSending(false);
                setISIN("");
            }}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Do you really want to " + buyOrSell + " this stock?"}</DialogTitle>
            <DialogContent>
                This action is irreversible!
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setISIN("")}>Close</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={sending}
                >
                    {sending ? "Sending..." : "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    );

};

export default BuyOrSellDialog;