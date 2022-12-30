import React, { createContext, useState } from "react";
import { AuthContextType, AuthData } from "./AuthContextType";

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
	children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
	const [auth, setAuth] = useState<AuthData>({
		username: "",
		isLoggedIn: false,
		role: "",
		accessToken: "",
	});

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
