import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../services/authService";

function VerifyOTPForm() {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOTP] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        try {

            const data = await verifyOTP({
                email,
                otp
            });

            alert(data.message);

            navigate("/login");

        }
        catch (err) {

            alert(err.response?.data?.message || "Verification Failed");

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <form onSubmit={handleSubmit}>

            <h2>Verify Email</h2>

            <p>{email}</p>

            <input

                type="text"

                placeholder="Enter OTP"

                value={otp}

                onChange={(e)=>setOTP(e.target.value)}

            />

            <br /><br />

            <button

                disabled={loading}

                type="submit"

            >

                {loading ? "Verifying..." : "Verify OTP"}

            </button>

        </form>

    );

}

export default VerifyOTPForm;