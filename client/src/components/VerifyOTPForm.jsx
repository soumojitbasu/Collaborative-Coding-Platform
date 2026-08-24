import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOTP } from "../services/authService";
import { useToast } from "../hooks/useToast";

function VerifyOTPForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { success, error: showError } = useToast();

    const devOtp = location.state?.devOtp;
    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOTP] = useState(devOtp || "");
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
            {devOtp && (
                <div style={{ padding: "10px 14px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", marginBottom: "16px", fontSize: "12px", color: "var(--accent-emerald)" }}>
                    <strong>🔑 Verification Code:</strong> <code>{devOtp}</code>
                    <div style={{ marginTop: "4px", fontSize: "11px", color: "var(--text-dim)" }}>
                        Code is auto-filled for instant verification.
                    </div>
                </div>
            )}

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
                {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span className="spinner-sm"></span>
                        <span>Verifying...</span>
                    </span>
                ) : (
                    "Verify & Activate Account"
                )}
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