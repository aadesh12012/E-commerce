/**
 * OTP verification email for user registration.
 */
function otpEmailTemplate(otp) {
    const appName = process.env.APP_NAME || "Black Lake";

    const subject = `Your ${appName} verification code`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
    <tr>
      <td style="padding:32px 28px;background:#0f172a;color:#ffffff;">
        <h1 style="margin:0;font-size:20px;font-weight:600;">${appName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;text-align:center;">
        <p style="margin:0 0 8px;font-size:15px;color:#475569;">Your verification code is</p>
        <p style="margin:0;font-size:36px;font-weight:700;letter-spacing:8px;color:#0f172a;">${otp}</p>
        <p style="margin:20px 0 0;font-size:14px;color:#94a3b8;">
          This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px;background:#f1f5f9;font-size:12px;color:#64748b;text-align:center;">
        If you did not request this code, you can safely ignore this email.
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = `Your ${appName} verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.`;

    return { subject, html, text };
}

module.exports = { otpEmailTemplate };
