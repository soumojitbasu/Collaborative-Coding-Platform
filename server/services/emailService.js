const nodemailer = require("nodemailer");

let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

const sendEmail = async (to, subject, text) => {
    try {
        if (!transporter) {
            console.warn(`\n[EMAIL SERVICE NOT CONFIGURED] Simulated email:`);
            console.warn(`To: ${to}`);
            console.warn(`Subject: ${subject}`);
            console.warn(`Content: ${text}\n`);
            return { messageId: "simulated-" + Date.now() };
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });

        return info;
    } catch (err) {
        console.error("Failed to send email via SMTP:", err.message);
        // Do not crash registration or reset in development/test environments
        return { error: err.message };
    }
};

module.exports = sendEmail;