import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

const testRequest = async () => {
	const response = await fetch(`/api/users/create`, {
		method: "POST",
		body: JSON.stringify({ username: "not-admin", pwd: "olaadeus" }),
	});

	if (!response.ok) {
		console.log("failed");
	}

	console.log(response.json());
};

function Home() {
	testRequest();

	return (
		<>
			<Typography variant="h5" component="h1">
				<strong>Home</strong>
			</Typography>
		</>
	);
}

export default Home;
