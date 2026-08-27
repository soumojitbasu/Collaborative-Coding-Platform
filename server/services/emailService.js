const nodemailer = require("nodemailer");

let transporter = null;

const initTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const cleanPass = process.env.EMAIL_PASS.replace(/\s+/g, "");
        const cleanUser = process.env.EMAIL_USER.trim();

        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: cleanUser,
                pass: cleanPass
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 15000,
            greetingTimeout: 15000,
            socketTimeout: 20000
        });
    }
};

initTransporter();

const sendEmail = async (to, subject, text, html = null) => {
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
        return { success: false, simulated: true, messageId: "simulated-" + Date.now() };
    }

    try {
        const cleanUser = process.env.EMAIL_USER.trim();
        const mailOptions = {
            from: `"SyncForge Support" <${cleanUser}>`,
            to: to.trim(),
            subject: subject.trim(),
            text: text,
            ...(html ? { html } : {})
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email delivered successfully to ${to} (Message ID: ${info.messageId})`);
        return { success: true, ...info };
    } catch (err) {
        console.error(`⚠️ Email delivery failed for ${to}:`, err.message);
        return { success: false, error: err.message };
    }
};

module.exports = sendEmail;