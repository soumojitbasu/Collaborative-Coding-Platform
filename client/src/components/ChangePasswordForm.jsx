import { useState } from "react";
import { changePassword } from "../services/authService";

function ChangePasswordForm() {

    const [formData, setFormData] = useState({

        currentPassword: "",

        newPassword: "",

        confirmPassword: ""

    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {

            alert("Passwords do not match");

            return;

        }

        try {

            setLoading(true);

            const data = await changePassword({

                currentPassword: formData.currentPassword,

                newPassword: formData.newPassword

            });

            alert(data.message);

            setFormData({

                currentPassword: "",

                newPassword: "",

                confirmPassword: ""

            });

        }

        catch (err) {

            alert(err.response?.data?.message);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <form onSubmit={handleSubmit}>

            <input

                type="password"

                name="currentPassword"

                placeholder="Current Password"

                value={formData.currentPassword}

                onChange={handleChange}

            />

            <br /><br />

            <input

                type="password"

                name="newPassword"

                placeholder="New Password"

                value={formData.newPassword}

                onChange={handleChange}

            />

            <br /><br />

            <input

                type="password"

                name="confirmPassword"

                placeholder="Confirm Password"

                value={formData.confirmPassword}

                onChange={handleChange}

            />

            <br /><br />

            <button
                disabled={loading}
            >

                {loading ? "Updating..." : "Change Password"}

            </button>

        </form>

    );

}

export default ChangePasswordForm;