import { Box, Button, Container, Typography } from "@mui/material";
import axios from "axios";

function CertificationAuthority() {
	return (
		<>
			<Typography component="h2" variant="h3" align="left">
				Certification Authority
			</Typography>
			<Box
				textAlign="center"
				sx={{
					bgcolor: "background.paper",
					pt: 8,
					pb: 6,
				}}
			>
				<Container maxWidth="sm">
					<Typography variant="h5" color="text.secondary" paragraph>
						The NCMB Certificate Authority (CA) was created to authenticate the
						digital certificates used by the services provided by NCMB.
					</Typography>
					<Button
						variant="contained"
						style={{ justifyContent: "center" }}
					>
						<a href="rootCA.crt" download style={{color: "inherit", textDecoration: "none"}}>
							Click here to download the CA certificate
						</a>
					</Button>
					<Typography sx={{ mt: 5 }}>
						SHA1 fingerprint: 6228f92962592780686b220d583c1278aadf066a <br />
						MD5 fingerprint: 10c7b54dab9d8c798cb789ad48835c9b
					</Typography>
					<Typography sx={{ mt: 5 }}>
						Fingerprints computed by the user should match the above fingerprints!
					</Typography>
				</Container>
			</Box>
		</>
	);
}

export default CertificationAuthority;
