import axios, { AxiosError } from "axios";
import { useMemo } from "react";
import useAuth from "../hooks/useAuth";

interface Props {
	children: React.ReactNode;
}

export const WithAxios = ({ children }: Props) => {
	const { auth } = useAuth();

	useMemo(() => {
		axios.interceptors.request.use(
			(config) => {
				const token = auth.accessToken;
				if (token) {
					config.headers!["Authorization"] = "Bearer " + token;
				}

				config.headers!["Content-Type"] = "application/json";
				config.headers!["Accept"] = "application/json";

				return config;
			},
			(error) => {
				Promise.reject(error);
			}
		);
	}, [auth]);

	return <>{children}</>;
};

// response interceptor to renew access token on receiving token expired error
axios.interceptors.response.use(undefined, async (error: AxiosError) => {
	// Access token expired
	if (error.response?.status === 403 && error.config) {
		const originalRequestConfig = error.config;
		delete originalRequestConfig?.headers!["Authorization"];

		try {
			const response = await axios.get("/api/auth/refresh", {
				withCredentials: true,
			});

			const { auth, setAuth } = useAuth();
			setAuth({
				isLoggedIn: true,
				isAdmin: auth.isAdmin,
				username: auth.username,
				accessToken: response.data.accessToken,
			});

			return axios.request(originalRequestConfig);
		} catch (error) {
			console.log(error);
		}
	}
});

export default axios;
