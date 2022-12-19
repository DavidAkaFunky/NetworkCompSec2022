import axios from "../interceptors/Axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {

        await axios.get('/api/auth/logout', {
            withCredentials: true
        });

        setAuth({
            isAdmin: false,
            isLoggedIn: false,
            username: "",
            accessToken: ""
        });
    }

    return logout;
}

export default useLogout;