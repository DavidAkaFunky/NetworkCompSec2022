import axios from "../interceptors/Axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { auth, setAuth } = useAuth();

	const refresh = async () => {
		try {
			const response = await axios.get("/api/auth/refresh", {
				withCredentials: true,
			});

			// TODO: isAdmin and username should come in the request
			setAuth({
				isLoggedIn: true,
				isAdmin: auth.isAdmin, // this doesnt work bc its reseted
				username: auth.username, // same here
				accessToken: response.data.accessToken,
			});

			return response.data.accessToken;
		} catch (err) {
			setAuth({
				isLoggedIn: false,
				isAdmin: false,
				username: "",
				accessToken: "",
			});
		}

		return null;
	};

	return refresh;
};

export default useRefreshToken;
