export interface UserData {
	isAdmin: boolean;
	isLoggedIn: boolean;
}

export type UserContextType = {
	user: UserData;
    setUser: (user: UserData) => void;
};
