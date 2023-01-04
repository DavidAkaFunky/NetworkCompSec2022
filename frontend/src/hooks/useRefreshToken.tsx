import axios from "../interceptors/Axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		try {
			const response = await axios.get("/api/auth/refresh", {
				withCredentials: true,
			});
			
			setAuth({
				isLoggedIn: true,
				role: response.data.role,
				username: response.data.name,
				accessToken: response.data.accessToken,
			});

			return response.data.accessToken;
		} catch (err) {
			setAuth({
				isLoggedIn: false,
				role: "",
				username: "",
				accessToken: "",
			});
		}

		return null;
	};

	return refresh;
};

export default useRefreshToken;
