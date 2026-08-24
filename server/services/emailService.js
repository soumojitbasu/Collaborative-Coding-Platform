const nodemailer = require("nodemailer");

let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 2500,
        greetingTimeout: 2500,
        socketTimeout: 3000
    });
}

const sendEmail = async (to, subject, text) => {
    // Prominently log OTP to server console
    console.log(`\n==================================================`);
    console.log(`📧 [EMAIL DISPATCH] To: ${to}`);
    console.log(`📋 [SUBJECT]: ${subject}`);
    console.log(`📝 [CONTENT]:\n${text}`);
    console.log(`==================================================\n`);

    if (!transporter) {
        console.warn(`[EMAIL NOTICE] EMAIL_USER / EMAIL_PASS not configured. Simulated delivery logged above.`);
        return { messageId: "simulated-" + Date.now() };
    }

    try {
        // Enforce hard 2.5-second timeout on sendMail
        const emailPromise = transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("SMTP connection timed out after 2.5s")), 2500)
        );

        const info = await Promise.race([emailPromise, timeoutPromise]);
        console.log(`✅ Email delivered successfully to ${to}`);
        return info;
    } catch (err) {
        console.error(`⚠️ Email delivery skipped/timed out for ${to}:`, err.message);
        return { error: err.message };
    }
};

module.exports = sendEmail;