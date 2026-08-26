const nodemailer = require("nodemailer");

let transporter = null;

const initTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Clean any spaces from EMAIL_PASS (Google App Passwords have spaces like 'xxxx yyyy zzzz wwww')
        const cleanPass = process.env.EMAIL_PASS.replace(/\s+/g, "");
        const cleanUser = process.env.EMAIL_USER.trim();

        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: cleanUser,
                pass: cleanPass
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000
        });
    }
};

initTransporter();

const sendEmail = async (to, subject, text) => {
    console.log(`\n==================================================`);
    console.log(`📧 [EMAIL DISPATCH] To: ${to}`);
    console.log(`📋 [SUBJECT]: ${subject}`);
    console.log(`📝 [CONTENT]:\n${text}`);
    console.log(`==================================================\n`);

    if (!transporter) {
        initTransporter();
    }

    if (!transporter) {
        console.warn(`[EMAIL NOTICE] EMAIL_USER / EMAIL_PASS not configured in environment.`);
        return { messageId: "simulated-" + Date.now() };
    }

    try {
        const cleanUser = process.env.EMAIL_USER.trim();
        const info = await transporter.sendMail({
            from: `"CodeSync" <${cleanUser}>`,
            to,
            subject,
            text
        });

        console.log(`✅ Email delivered successfully to ${to} (Message ID: ${info.messageId})`);
        return info;
    } catch (err) {
        console.error(`⚠️ Email delivery failed for ${to}:`, err.message);
        return { error: err.message };
    }
};

module.exports = sendEmail;