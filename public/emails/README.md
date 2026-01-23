# TBM Events – Email templates

These templates are **standalone HTML files** intended for transactional emails.
They use **table layout + inline styles** for maximum email client compatibility and match the app’s design system:
- Brand gradient: `#E8B025 → #4F8A92`
- Typography: Inter / Manrope
- Surfaces: Slate-like light UI

## Files
- `welcome-organizer.html` – Welcome email for newly signed-up organizers
- `welcome-attendee.html` – Welcome email for newly signed-up attendees (customers)
- `admin-new-organizer-signup.html` – Notification to admin when a new organizer signs up
- `otp-verification.html` – General OTP email for verification, password reset, etc.

## Placeholder variables
These templates use Mustache/Handlebars-style placeholders like `{{variable}}`. Replace them using whatever templating approach your email service supports.

Common placeholders:
- `{{brandLogoUrl}}` (recommended: absolute URL in production)
- `{{currentYear}}`
- `{{supportEmail}}`

Welcome organizer:
- `{{organizerName}}`
- `{{organizerEmail}}`
- `{{organizationName}}`
- `{{signupDate}}`
- `{{dashboardUrl}}`
- `{{createEventUrl}}`
- `{{helpCenterUrl}}`
- `{{companyAddress}}`

Welcome attendee:
- `{{attendeeName}}`
- `{{exploreUrl}}`
- `{{profileUrl}}`
- `{{companyAddress}}`

Admin notification:
- `{{timestamp}}`
- `{{organizerName}}`, `{{organizerEmail}}`, `{{organizationName}}`, `{{phoneNumber}}`, `{{country}}`
- `{{signupSource}}` (e.g. "Web", "Referral")
- `{{organizerId}}`
- `{{adminReviewUrl}}`
- `{{adminDashboardUrl}}`

OTP verification:
- `{{timestamp}}`
- `{{otpPurposeLabel}}` (e.g. "Email verification", "Password reset")
- `{{otpTitle}}` (e.g. "Verify your email")
- `{{recipientName}}`
- `{{otpActionText}}` (e.g. "verify your email", "reset your password")
- `{{otpExpiryMinutes}}`
- `{{otpCode}}`

## Notes
- Email clients often don’t load relative image paths. Use an absolute `brandLogoUrl` such as `https://your-domain.com/images/tbm-logo.png`.
- If you use an ESP (Resend, Postmark, SendGrid), you can upload these HTML templates directly.
