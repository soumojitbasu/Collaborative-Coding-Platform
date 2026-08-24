const nodemailer = require("nodemailer");

let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 3500,
        greetingTimeout: 3500,
        socketTimeout: 5000
    });
}

const sendEmail = async (to, subject, text) => {
    // Log clearly to server logs for instant debugging and demoing
    console.log(`\n📧 [EMAIL DISPATCH] To: ${to} | Subject: ${subject}`);
    console.log(`--------------------------------------------------\n${text}\n--------------------------------------------------`);

    try {
        if (!transporter) {
            console.warn(`[EMAIL NOTICE] EMAIL_USER or EMAIL_PASS not set. Using simulated delivery.`);
            return { messageId: "simulated-" + Date.now() };
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });

        console.log(`✅ Email delivered successfully to ${to}`);
        return info;
    } catch (err) {
        console.error(`⚠️ Email delivery failed to ${to}:`, err.message);
        return { error: err.message };
    }
};

module.exports = sendEmail;