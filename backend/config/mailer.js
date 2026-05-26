const nodemailer = require("nodemailer");

let transporter = null;

function getEmailUser() {
    return process.env.EMAIL_USER || process.env.EMAIL;
}

function getEmailHost() {
    if (process.env.EMAIL_HOST) return process.env.EMAIL_HOST;
    const user = getEmailUser() || "";
    if (user.endsWith("@gmail.com")) return "smtp.gmail.com";
    return null;
}

/** Gmail app passwords are 16 chars — strip spaces if copied with gaps */
function getEmailPass() {
    const pass = process.env.EMAIL_PASS || "";
    return pass.replace(/\s/g, "");
}

/**
 * Returns true when minimum SMTP env vars are set.
 */
function isEmailConfigured() {
    return Boolean(getEmailHost() && getEmailUser() && getEmailPass());
}

/**
 * Reusable Nodemailer transporter (singleton).
 */
function getTransporter() {
    if (!isEmailConfigured()) {
        throw new Error(
            "Email is not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in .env"
        );
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: getEmailHost(),
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: getEmailUser(),
                pass: getEmailPass(),
            },
        });
    }

    return transporter;
}

/**
 * Verifies SMTP connection on server start (logs only; does not crash app).
 */
async function verifyEmailConnection() {
    if (!isEmailConfigured()) {
        console.warn(
            "Email: skipped — add EMAIL_HOST, EMAIL_USER, EMAIL_PASS to .env to enable"
        );
        return false;
    }

    try {
        await getTransporter().verify();
        console.log("Email: SMTP connection verified");
        return true;
    } catch (err) {
        console.warn("Email: SMTP verification failed —", err.message);
        return false;
    }
}

module.exports = {
    getTransporter,
    isEmailConfigured,
    verifyEmailConnection,
};
