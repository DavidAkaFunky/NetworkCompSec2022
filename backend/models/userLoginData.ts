export default interface UserLoginData {
    email: string;
    password: string;
    secret?: string;
    token: string;
}