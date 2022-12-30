import { UserRoles } from "./userRoles";

export default interface UserLoggedData {
    name: string;
    email: string;
    role: UserRoles;
    accessToken: string;
    refreshToken: string;
}