import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPasswordForm() {

    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        try {

            const data = await resetPassword({
                password
            });

            alert(data.message);

            navigate("/login");

        } catch (err) {

            alert(err.response?.data?.message || "Something went wrong");

        } finally {

            setLoading(false);

        }

    }

    return (

        <form onSubmit={handleSubmit}>

            <input
                type="password"
                placeholder="Enter New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button
                type="submit"
                disabled={loading}
            >
                {loading ? "Updating..." : "Reset Password"}
            </button>

        </form>

    );

}

export default ResetPasswordForm;