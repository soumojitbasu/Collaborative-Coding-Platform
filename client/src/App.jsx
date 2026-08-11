import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RoomPage from "./pages/RoomPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <Routes>

            <Route element={<MainLayout/>}>

            <Route path="/" element={<LandingPage/>}/>

            <Route path="/register" element={<RegisterPage/>}/>

            <Route path="/verify-otp" element={<VerifyOTPPage/>}/>

            <Route path="/login" element={<LoginPage/>}/>

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardPage/>
                </ProtectedRoute>
            }/>

            <Route path="/room/:roomId" element={
                <ProtectedRoute>
                    <RoomPage/>
                </ProtectedRoute>
            }/>
            <Route path="/change-password" element={
                <ProtectedRoute>
                    <ChangePasswordPage/>
                </ProtectedRoute>
            }/>

            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

            <Route path="/reset-password" element={<ResetPasswordPage/>}/>

            </Route>

        </Routes>

    );

}

export default App;