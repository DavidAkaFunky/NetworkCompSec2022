export interface AuthData {
	isAdmin: boolean;
	isLoggedIn: boolean;
	username: string;
    accessToken: string;
}

export type AuthContextType = {
	auth: AuthData;
    setAuth: (auth: AuthData) => void;
};