import React, { createContext, useState } from "react";
import { UserContextType, UserData } from "./UserContextType";

export const UserContext = createContext<UserContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

const UserProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<UserData>({
        username: "H. Ramos",
        isLoggedIn: true,
        isAdmin: true,
    });

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;