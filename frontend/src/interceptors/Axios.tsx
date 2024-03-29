import axios, { AxiosError } from "axios";
import { useMemo } from "react";
import useAuth from "../hooks/useAuth";

interface Props {
	children: React.ReactNode;
}

export const WithAxios = ({ children }: Props) => {
	const { auth, setAuth } = useAuth();

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

		axios.interceptors.response.use(undefined, async (error: AxiosError) => {
			// Access token expired
			if (error.response?.status === 403 && error.config) {
				const originalRequestConfig = error.config;
				delete originalRequestConfig?.headers!["Authorization"];
		
				try {
					const response = await axios.get("/api/auth/refresh", {
						withCredentials: true,
					});

					setAuth({
						isLoggedIn: true,
						role: auth.role,
						username: auth.username,
						accessToken: response.data.accessToken,
					});
		
					return axios.request(originalRequestConfig);
				} catch (error) {
					
					return Promise.reject(error);
				}
			} else {
				return Promise.reject(error.response?.data);
			}
		});
	}, [auth]);

	return <>{children}</>;
};

// response interceptor to renew access token on receiving token expired error


export default axios;
