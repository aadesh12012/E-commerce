/**
 * HTML email template — product deleted by seller.
 */
function productDeletedTemplate(productName) {
    const appName = process.env.APP_NAME || "Your Store";
    const safeName = productName || "your product";

    const subject = `Product deleted — ${safeName}`;

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
      <td style="padding:28px;">
        <h2 style="margin:0 0 12px;font-size:18px;color:#0f172a;">Product removed</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569;">
          Your listing <strong style="color:#0f172a;">${safeName}</strong> has been permanently deleted from the marketplace.
        </p>
        <p style="margin:0;font-size:14px;color:#94a3b8;">
          If you did not perform this action, please contact support immediately.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px;background:#f1f5f9;font-size:12px;color:#64748b;">
        This is an automated message from ${appName}. Please do not reply to this email.
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text = `Product removed from ${appName}\n\nYour listing "${safeName}" has been permanently deleted.\n\nIf you did not perform this action, contact support.`;

    return { subject, html, text };
}

module.exports = { productDeletedTemplate };
