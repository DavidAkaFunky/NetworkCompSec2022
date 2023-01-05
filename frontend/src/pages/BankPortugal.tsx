import {
	Box,
	Button,
	TextField,
	Typography,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


function BankPortugal() {

    const [generalError, setGeneralError] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [sending, setSending] = useState(false);

    const navigate = useNavigate();

    const handleSumit = async () => {
        setSending(true);
        try {
            const response = await axios.post("/api/bankportugal/newClient", {
                name,
                email,
                address,
                phoneNumber,
            });
            
            if(response.status === 200)
                navigate("/admin");
            else
                setGeneralError("Unable to send client info to Bank of Portugal.");

        } catch (error: any) {
            setGeneralError("Unable to send client info to Bank of Portugal.");
        } finally {
            setSending(false);
        }
        
    };

    return (
        <Box sx={{ mx: "auto", width: "80vw", maxWidth: 500 }}>
            <Typography variant="h4" component="h1">
                <strong>Send Client Info to Bank of Portugal</strong>
            </Typography>
            {generalError != "" && (
                <Typography fontSize={15} color="red">
                    There was an error when submiting: {generalError}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={name.length > 0}
                />
                <TextField
                    margin="normal"
                    variant="filled"
                    required
                    fullWidth
                    id="email"
                    label={"Email Address"}
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={email.length > 0}
                />
                <TextField
                    margin="normal"
                    variant="filled"
                    required
                    fullWidth
                    name="PhoneNumber"
                    label={"Phone Number"}
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    error={phoneNumber.length > 0}
                />
                <TextField
                    margin="normal"
                    variant="filled"
                    required
                    fullWidth
                    name="address"
                    label={"Address"}
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    error={address.length > 0}
                />
                <Button
                    fullWidth
                    onClick={handleSumit}
                    variant="contained"
                    sx={{ mt: 3 }}
                    disabled={!name || !email || !phoneNumber || !address || sending}
                >
                    {sending ? "Sending..." : "Submit"}
                </Button>
            </Box>
        </Box>
    );
}

export default BankPortugal;