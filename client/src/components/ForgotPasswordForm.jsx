import { useState } from "react";
import { forgotPassword } from "../services/authService";

function ForgotPasswordForm() {

    const [email, setEmail] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const data = await forgotPassword({
                email
            });

            alert(data.message);

        }
        catch (err) {

            alert(err.response?.data?.message);

        }

    }

    return (

        <form onSubmit={handleSubmit}>

            <input

                type="email"

                placeholder="Email"

                value={email}

                onChange={(e)=>setEmail(e.target.value)}

            />

            <br /><br />

            <button>

                Send OTP

            </button>

        </form>

    );

}

export default ForgotPasswordForm;