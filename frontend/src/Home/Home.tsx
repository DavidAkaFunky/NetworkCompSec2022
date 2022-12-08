const testRequest = async () => {
    const response = await fetch(`/api/users/create`, {
		method: "POST",
		body: JSON.stringify({ username: "not-admin", pwd: "olaadeus" }),
	});

    if(!response.ok){
        console.log("failed");
    }

    console.log(response.json());
}

function Home() {
	testRequest();

	return (
		<div>
			<h1>Home</h1>
		</div>
	);
}

export default Home;
