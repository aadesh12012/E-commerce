/**
 * Welcome email sent after successful user registration.
 */
function welcomeEmailTemplate(userName) {
    const appName = process.env.APP_NAME || "Black Lake";
    const safeName = userName || "there";

    const subject = `Welcome to ${appName}!`;

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
        <h1 style="margin:0;font-size:20px;font-weight:600;">Welcome to ${appName}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        <h2 style="margin:0 0 12px;font-size:18px;color:#0f172a;">Hi ${safeName},</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569;">
          Your account has been created successfully. You can now sign in, browse products, and start shopping.
        </p>
        <p style="margin:0;font-size:14px;color:#94a3b8;">
          If you did not create this account, please ignore this email or contact support.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px;background:#f1f5f9;font-size:12px;color:#64748b;">
        Thanks for joining ${appName}!
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = `Welcome to ${appName}!\n\nHi ${safeName},\n\nYour account has been created successfully. You can now sign in and start shopping.\n\nIf you did not create this account, please ignore this email.`;

    return { subject, html, text };
}

module.exports = { welcomeEmailTemplate };
