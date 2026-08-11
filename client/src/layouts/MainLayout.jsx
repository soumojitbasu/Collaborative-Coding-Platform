import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <>
            <nav>
                <h2>CodeSync</h2>
            </nav>

            <Outlet />

            <footer>
                © CodeSync
            </footer>
        </>
    );
}

export default MainLayout;