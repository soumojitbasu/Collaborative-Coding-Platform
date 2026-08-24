import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOTP } from "../services/authService";
import { useToast } from "../hooks/useToast";

function VerifyOTPForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { success, error: showError } = useToast();

    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOTP] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email.trim() || !otp.trim()) {
            showError("Please enter your email and 6-digit OTP");
            return;
        }

        setLoading(true);

        try {
            const data = await verifyOTP({
                email: email.trim(),
                otp: otp.trim()
            });

            success(data.message || "Email verified successfully! You can now log in.");
            navigate("/login");
        } catch (err) {
            showError(err.response?.data?.message || "OTP verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label className="input-label" htmlFor="otp-email">Email Address</label>
                <input
                    id="otp-email"
                    className="input-field"
                    type="email"
                    placeholder="alex@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label className="input-label" htmlFor="otp-code">6-Digit Verification Code</label>
                <input
                    id="otp-code"
                    className="input-field"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    required
                    style={{ letterSpacing: "4px", fontSize: "18px", textAlign: "center", fontWeight: 700 }}
                    value={otp}
                    onChange={(e) => setOTP(e.target.value.replace(/\D/g, ""))}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "8px" }}
                disabled={loading}
            >
                {loading ? "Verifying..." : "Verify & Activate Account"}
            </button>

            <div className="auth-footer-links">
                <p>
                    Wrong email or need a new code?{" "}
                    <Link to="/register" style={{ fontWeight: 600 }}>
                        Register again
                    </Link>
                </p>
                <p>
                    <Link to="/login">
                        Back to Login
                    </Link>
                </p>
            </div>
        </form>
    );
}

export default VerifyOTPForm;