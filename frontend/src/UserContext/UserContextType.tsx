export interface UserData {
	isAdmin: boolean;
	isLoggedIn: boolean;
	username: string;
}

export type UserContextType = {
	user: UserData;
    setUser: (user: UserData) => void;
};
