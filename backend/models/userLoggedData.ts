export default interface UserLoggedData {
    name: string;
    email: string;
    isAdmin: boolean;
    accessToken: string;
    refreshToken: string;
}