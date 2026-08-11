import { createContext, useState,useEffect } from "react";
import { getUser } from "../utils/auth";
import { getCurrentUser } from "../services/authService";
export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(getUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initializeAuth() {
            try {
                const user= await getCurrentUser();
                setUser(user);
            } catch{
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        initializeAuth();
    }, []);

    return (

        <AuthContext.Provider 
        value={{ 
            user, 
            setUser,
            loading,
        }} 
        >

            {children}

        </AuthContext.Provider>

    );

}
export default AuthProvider;