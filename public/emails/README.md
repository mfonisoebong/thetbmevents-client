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
- `payment-confirmation-attendee.html` – Payment confirmation + ticket details (includes QR)
- `payment-notification-admin.html` – Brief admin notification for a new payment
- `payment-notification-organizer.html` – Brief organizer notification for a new ticket purchase
- `coupon-referral-notification.html` – Brief notification to the coupon referrer when code is used

## Placeholder variables
These templates use Mustache/Handlebars-style placeholders like `{{variable}}`. Replace them using whatever templating approach your email service supports.

Common placeholders:
- `{{currentYear}}`
- `{{supportEmail}}`

Welcome organizer:
- `{{brandLogoUrl}}` (recommended: absolute URL in production)
- `{{organizerName}}`
- `{{organizerEmail}}`
- `{{organizationName}}`
- `{{signupDate}}`
- `{{dashboardUrl}}`
- `{{createEventUrl}}`
- `{{helpCenterUrl}}`
- `{{companyAddress}}`

Welcome attendee:
- `{{brandLogoUrl}}` (recommended: absolute URL in production)
- `{{attendeeName}}`
- `{{exploreUrl}}`
- `{{profileUrl}}`
- `{{companyAddress}}`

Admin new organizer notification:
- `{{brandLogoUrl}}` (recommended: absolute URL in production)
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

Payment confirmation (attendee):
- `{{attendeeName}}`
- `{{eventName}}`
- `{{eventLocation}}`
- `{{eventVirtualLink}}` (URL)
- `{{eventVirtualLinkLabel}}` (e.g. "Join link" or "Not applicable")
- `{{eventPageUrl}}`
- `{{ticketId}}`
- `{{ticketName}}`
- `{{purchaseDateTime}}`
- `{{paymentGateway}}` (e.g. "Paystack")
- `{{qrCodeImageUrl}}` (**absolute** URL or `data:image/png;base64,...`)
- `{{companyAddress}}`

Payment notification (admin):
- `{{timestamp}}`
- `{{amountPaid}}`
- `{{paymentGateway}}`
- `{{eventName}}`
- `{{ticketName}}`
- `{{attendeeName}}`
- `{{attendeeEmail}}`
- `{{ticketId}}`
- `{{purchaseDateTime}}`
- `{{adminOrderUrl}}`

Payment notification (organizer):
- `{{timestamp}}`
- `{{amountPaid}}`
- `{{ticketName}}`
- `{{eventName}}`
- `{{attendeeName}}`
- `{{ticketId}}`
- `{{purchaseDateTime}}`
- `{{organizerSalesUrl}}`

Coupon referral notification:
- `{{timestamp}}`
- `{{referrerName}}`
- `{{couponCode}}`
- `{{eventName}}`
- `{{amountPaid}}`
- `{{referralReward}}`
- `{{referralDashboardUrl}}`

## Notes
- Email clients often don’t load relative image paths. Prefer absolute URLs.
- For QR codes, either host the image with a public URL (`{{qrCodeImageUrl}}`) or embed a Base64 data URL.
- If you use an ESP (Resend, Postmark, SendGrid), you can upload these HTML templates directly.
