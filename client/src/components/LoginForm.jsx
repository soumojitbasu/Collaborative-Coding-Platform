import socket from "../socket/socket";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authService";
import { saveToken } from "../utils/auth";
import { saveUser } from "../utils/auth";
import { useAuth } from "../hooks/useAuth";

function LoginForm() {

    const navigate = useNavigate();

    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    function handleChange(event) {

        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

    }

    async function handleSubmit(event) {

        event.preventDefault();

        setLoading(true);

        try {

            const data = await login(formData);

            saveToken(data.token);
            saveUser(data.user);
            setUser(data.user);
            
            socket.auth = {
             token: data.token
            };

            socket.connect();
            socket.once("connect", () => {

    navigate("/dashboard");

});

        }
        catch (error) {

            console.log(error.response.data.message);

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <form onSubmit={handleSubmit}>

            <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
            />

            <br /><br />

            <button
                type="submit"
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
            <br/><br/>

            <button
                type="button"
                onClick={()=>navigate("/forgot-password")}
            >

            Forgot Password?

            </button>
        </form>

    );

}

export default LoginForm;