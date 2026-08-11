import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <>
            <h1>Welcome to CodeSync</h1>

            <Link to="/login">
                Login
            </Link>

            <br />

            <Link to="/register">
                Register
            </Link>
        </>
    );
}

export default LandingPage;