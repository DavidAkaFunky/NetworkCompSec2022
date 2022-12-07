function Home() {
    fetch(`/api/users/create`,
        {   
            method: 'POST',
            body: JSON.stringify({username: "FUNKY", pwd: "hut40b3stg1rl"})
        })
        .then((res) => res.json());

    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}

export default Home;