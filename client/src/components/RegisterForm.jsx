import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

function RegisterForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const data = await register(formData);

            alert(data.message);

            navigate("/verify-otp", {

                  state: {

                      email: formData.email

                  }

              });

        } catch (err) {

            alert(err.response?.data?.message);

        }

    }

    return (

        <form onSubmit={handleSubmit}>

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />

            <br /><br />

            <button type="submit">
                Register
            </button>

        </form>

    );

}

export default RegisterForm;