import { useEffect } from "react";
import axios from "../interceptors/Axios";
import useAuth from "./useAuth";

const useLogout = () => {
	const { setAuth } = useAuth();

	const logout = async () => {
		
		setAuth({
			isAdmin: false,
			isLoggedIn: false,
			username: "",
			accessToken: "",
		});

		// TODO: should find a way to wait for the setAuth to finish

		await axios.get("/api/auth/logout", {
			withCredentials: true,
		});

	};

	return logout;
};

export default useLogout;
