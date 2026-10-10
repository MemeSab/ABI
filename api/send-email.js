// Vercel Serverless Function: /api/send-email
export default async function handler(req, res) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        const { type, name, email, packageName, resourceName, message } = req.body || {};

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email address is required.' });
        }

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('RESEND_API_KEY environment variable is not configured.');
            return res.status(500).json({
                success: false,
                error: 'RESEND_API_KEY is not configured in Vercel environment variables.'
            });
        }

        const clientName = (name || '').trim() || 'there';
        const senderFrom = process.env.RESEND_FROM || 'Abigail Stocks <onboarding@resend.dev>';
        const abiEmail = 'abigailstockscoaching@gmail.com';
        const helloEmail = 'hello@abigailstocks.com';

        let subject = '';
        let textContent = '';
        let htmlContent = '';

        if (type === 'package') {
            const pkg = packageName || 'Single Habit Reset';
            if (pkg === 'Single Habit Reset') {
                subject = 'Your Single Habit Reset Details - Abigail Stocks Coaching';
                textContent = `Hi ${clientName},

Thank you for your enquiry about the Single Habit Reset with Abigail Stocks Coaching!

Here is what is included in your 1:1 Deep Dive:
• 60 Mins intensive 1:1 coaching session
• Current routine audit & block identification
• Actionable post-call habit blueprint
• Comprehensive email recap with custom action steps

Investment: £75

Ready to begin? You can secure your session directly via Stripe:
https://buy.stripe.com/dRm8wQ6Z84ELaJ0caA6sw00

Would you prefer to chat first? Book a complimentary 30-minute Discovery Call:
https://calendly.com/hello-abigailstocks/30min

If you have any questions, simply reply directly to this email or reach out to hello@abigailstocks.com.

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

                htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2D3748; line-height: 1.6;">
    <h2 style="color: #1A365D; margin-top: 0;">Hi ${clientName},</h2>
    <p>Thank you for enquiring about the <strong>Single Habit Reset</strong> with Abigail Stocks Coaching!</p>
    <div style="background: #F7FAFC; border-left: 4px solid #319795; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #2C7A7B;">What's Included in Your 1:1 Deep Dive:</h3>
        <ul style="padding-left: 20px; margin-bottom: 0;">
            <li><strong>60 Mins</strong> intensive 1:1 coaching session</li>
            <li>Current routine audit & block identification</li>
            <li>Actionable post-call habit blueprint</li>
            <li>Comprehensive email recap with custom action steps</li>
        </ul>
        <p style="font-size: 18px; font-weight: bold; margin: 12px 0 0; color: #1A365D;">Investment: £75</p>
    </div>
    <div style="margin: 28px 0;">
        <a href="https://buy.stripe.com/dRm8wQ6Z84ELaJ0caA6sw00" style="display: inline-block; background: #319795; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 16px;">Secure Session via Stripe (£75) &rarr;</a>
    </div>
    <p>Prefer to chat first? <a href="https://calendly.com/hello-abigailstocks/30min" style="color: #319795; text-decoration: underline;">Book a complimentary 30-minute Discovery Call on Calendly</a>.</p>
    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
    <p style="font-size: 14px; color: #718096; margin-bottom: 4px;">Warmly,</p>
    <p style="font-size: 15px; font-weight: bold; color: #1A365D; margin: 0;">Abigail Stocks</p>
    <p style="font-size: 13px; color: #718096; margin: 0;">Habit & Mindset Coach &bull; <a href="https://abigailstocks.com" style="color: #319795;">abigailstocks.com</a></p>
</div>`;
            } else if (pkg === '6-Session Momentum') {
                subject = 'Your 6-Session Momentum Package Details - Abigail Stocks Coaching';
                textContent = `Hi ${clientName},

Thank you for your enquiry about the 6-Session Momentum Package with Abigail Stocks Coaching!

Here is what is included in your coaching journey:
• 6 x 60 Mins dedicated 1:1 coaching sessions
• Weekly or bi-weekly accountability check-ins
• Mindset & movement worksheets & tailored guides
• Direct email support between sessions

Investment: £420

Ready to secure your package? You can complete checkout directly via Stripe:
https://buy.stripe.com/00w00k0AK0ovaJ0eiI6sw01

Would you prefer to chat first? Book a complimentary 30-minute Discovery Call:
https://calendly.com/hello-abigailstocks/30min

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

                htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2D3748; line-height: 1.6;">
    <h2 style="color: #1A365D; margin-top: 0;">Hi ${clientName},</h2>
    <p>Thank you for enquiring about the <strong>6-Session Momentum Package</strong> with Abigail Stocks Coaching!</p>
    <div style="background: #F7FAFC; border-left: 4px solid #319795; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #2C7A7B;">What's Included in Your Momentum Pathway:</h3>
        <ul style="padding-left: 20px; margin-bottom: 0;">
            <li><strong>6 x 60 Mins</strong> dedicated 1:1 coaching sessions</li>
            <li>Weekly or bi-weekly accountability check-ins</li>
            <li>Mindset & movement worksheets & tailored guides</li>
            <li>Direct email support between sessions</li>
        </ul>
        <p style="font-size: 18px; font-weight: bold; margin: 12px 0 0; color: #1A365D;">Investment: £420</p>
    </div>
    <div style="margin: 28px 0;">
        <a href="https://buy.stripe.com/00w00k0AK0ovaJ0eiI6sw01" style="display: inline-block; background: #319795; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 16px;">Secure 6-Session Package via Stripe (£420) &rarr;</a>
    </div>
    <p>Prefer to chat first? <a href="https://calendly.com/hello-abigailstocks/30min" style="color: #319795; text-decoration: underline;">Book a complimentary 30-minute Discovery Call on Calendly</a>.</p>
    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
    <p style="font-size: 14px; color: #718096; margin-bottom: 4px;">Warmly,</p>
    <p style="font-size: 15px; font-weight: bold; color: #1A365D; margin: 0;">Abigail Stocks</p>
    <p style="font-size: 13px; color: #718096; margin: 0;">Habit & Mindset Coach &bull; <a href="https://abigailstocks.com" style="color: #319795;">abigailstocks.com</a></p>
</div>`;
            } else {
                subject = 'Your 12-Session Transformation Details - Abigail Stocks Coaching';
                textContent = `Hi ${clientName},

Thank you for your enquiry about the 12-Session Transformation Package with Abigail Stocks Coaching!

Here is what is included in your full transformation journey:
• 12 x 60 Mins deep-dive 1:1 sessions
• Complete habit transformation roadmap
• Ongoing priority message & direct email support
• Custom wellness logs & personalized tools

Investment: £780

Ready to secure your package? You can complete checkout directly via Stripe:
https://buy.stripe.com/cNi3cwcjs0ov18q3E46sw02

Would you prefer to chat first? Book a complimentary 30-minute Discovery Call:
https://calendly.com/hello-abigailstocks/30min

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

                htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2D3748; line-height: 1.6;">
    <h2 style="color: #1A365D; margin-top: 0;">Hi ${clientName},</h2>
    <p>Thank you for enquiring about the <strong>12-Session Transformation Package</strong> with Abigail Stocks Coaching!</p>
    <div style="background: #F7FAFC; border-left: 4px solid #319795; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <h3 style="margin-top: 0; color: #2C7A7B;">What's Included in Your Full Transformation:</h3>
        <ul style="padding-left: 20px; margin-bottom: 0;">
            <li><strong>12 x 60 Mins</strong> deep-dive 1:1 sessions</li>
            <li>Complete habit transformation roadmap</li>
            <li>Ongoing priority message & direct email support</li>
            <li>Custom wellness logs & personalized tools</li>
        </ul>
        <p style="font-size: 18px; font-weight: bold; margin: 12px 0 0; color: #1A365D;">Investment: £780</p>
    </div>
    <div style="margin: 28px 0;">
        <a href="https://buy.stripe.com/cNi3cwcjs0ov18q3E46sw02" style="display: inline-block; background: #319795; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 16px;">Secure 12-Session Package via Stripe (£780) &rarr;</a>
    </div>
    <p>Prefer to chat first? <a href="https://calendly.com/hello-abigailstocks/30min" style="color: #319795; text-decoration: underline;">Book a complimentary 30-minute Discovery Call on Calendly</a>.</p>
    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
    <p style="font-size: 14px; color: #718096; margin-bottom: 4px;">Warmly,</p>
    <p style="font-size: 15px; font-weight: bold; color: #1A365D; margin: 0;">Abigail Stocks</p>
    <p style="font-size: 13px; color: #718096; margin: 0;">Habit & Mindset Coach &bull; <a href="https://abigailstocks.com" style="color: #319795;">abigailstocks.com</a></p>
</div>`;
            }
        } else if (type === 'resource') {
            const resLower = (resourceName || '').toLowerCase();
            let resTitle = 'Movement & Mindset Guide';
            let pdfLink = 'https://abigailstocks.com/assets/movement-mindset-guide.pdf';
            let webLink = 'https://abigailstocks.com/movement-mindset-guide.html';

            if (resLower.includes('morning') || resLower.includes('checklist')) {
                resTitle = 'Morning Wellness Checklist';
                pdfLink = 'https://abigailstocks.com/assets/morning-wellness-checklist.pdf';
                webLink = 'https://abigailstocks.com/morning-wellness-checklist.html';
            } else if (resLower.includes('reflection') || resLower.includes('prompts')) {
                resTitle = 'Weekly Reflection Prompts';
                pdfLink = 'https://abigailstocks.com/assets/weekly-reflection-prompts.pdf';
                webLink = 'https://abigailstocks.com/weekly-reflection-prompts.html';
            } else if (resLower.includes('habit') || resLower.includes('tracker')) {
                resTitle = 'Daily Healthy Habits Tracker';
                pdfLink = 'https://abigailstocks.com/assets/daily-habits-tracker.pdf';
                webLink = 'https://abigailstocks.com/daily-habits-tracker.html';
            }

            subject = `Your Free ${resTitle} - Abigail Stocks Coaching`;
            textContent = `Hi ${clientName},

Thank you for downloading the ${resTitle} from Abigail Stocks Coaching!

Here are your direct access links:
• Download PDF: ${pdfLink}
• Open Interactive Web Version: ${webLink}

When you're ready to design routines that truly stick:
• Book a free 30-minute Discovery Call: https://calendly.com/hello-abigailstocks/30min

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

            htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2D3748; line-height: 1.6;">
    <h2 style="color: #1A365D; margin-top: 0;">Hi ${clientName},</h2>
    <p>Thank you for downloading the <strong>${resTitle}</strong> from Abigail Stocks Coaching!</p>
    <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #E2E8F0;">
        <h3 style="margin-top: 0; color: #2C7A7B;">Instant Access:</h3>
        <p style="margin-bottom: 16px;"><a href="${pdfLink}" style="display: inline-block; background: #319795; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600;">📥 Download Printable PDF</a></p>
        <p style="margin: 0;"><a href="${webLink}" style="color: #319795; font-weight: 500;">📱 Open Interactive Web Version &rarr;</a></p>
    </div>
    <p>Whenever you're ready to accelerate your habit transformation: <a href="https://calendly.com/hello-abigailstocks/30min" style="color: #319795; text-decoration: underline;">Book a free 30-minute Discovery Call on Calendly</a>.</p>
    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
    <p style="font-size: 14px; color: #718096; margin-bottom: 4px;">Warmly,</p>
    <p style="font-size: 15px; font-weight: bold; color: #1A365D; margin: 0;">Abigail Stocks</p>
    <p style="font-size: 13px; color: #718096; margin: 0;">Habit & Mindset Coach &bull; <a href="https://abigailstocks.com" style="color: #319795;">abigailstocks.com</a></p>
</div>`;
        } else if (type === 'contact') {
            subject = 'Thank you for reaching out - Abigail Stocks Coaching';
            textContent = `Hi ${clientName},

Thank you for getting in touch with Abigail Stocks Coaching!

I have received your message and will get back to you personally within 24-48 hours.

If you'd like to jump straight into a conversation about your habits and goals, you can book a free 30-minute Discovery Call right here:
https://calendly.com/hello-abigailstocks/30min

Speak soon,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

            htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2D3748; line-height: 1.6;">
    <h2 style="color: #1A365D; margin-top: 0;">Hi ${clientName},</h2>
    <p>Thank you for getting in touch with Abigail Stocks Coaching!</p>
    <p>I have received your message and will get back to you personally within 24-48 business hours.</p>
    <p>If you'd like to jump straight into a conversation about your habits and routines: <a href="https://calendly.com/hello-abigailstocks/30min" style="color: #319795; text-decoration: underline;">Book a free 30-minute Discovery Call on Calendly</a>.</p>
    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
    <p style="font-size: 14px; color: #718096; margin-bottom: 4px;">Speak soon,</p>
    <p style="font-size: 15px; font-weight: bold; color: #1A365D; margin: 0;">Abigail Stocks</p>
    <p style="font-size: 13px; color: #718096; margin: 0;">Habit & Mindset Coach &bull; <a href="https://abigailstocks.com" style="color: #319795;">abigailstocks.com</a></p>
</div>`;
        } else if (type === 'waitlist') {
            subject = "You're on the list! - The Strive Podcast with Abigail Stocks";
            textContent = `Hi ${clientName},

Thank you for joining the waitlist for The Strive Podcast with Abigail Stocks!

You'll be the first to know as soon as full episodes drop, plus you'll receive exclusive subscriber guides and candid conversations on habits, fitness, and mindset.

In the meantime, you can listen to the preview audio and watch chapter clips anytime here:
https://abigailstocks.com/podcast

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

            htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2D3748; line-height: 1.6;">
    <h2 style="color: #1A365D; margin-top: 0;">Hi ${clientName},</h2>
    <p>Thank you for joining the waitlist for <strong>The Strive Podcast</strong> with Abigail Stocks!</p>
    <p>You'll be the first to know as soon as full episodes drop, plus you'll receive exclusive subscriber guides and candid conversations on habits, fitness, and mindset.</p>
    <p>In the meantime, listen to the preview episode and explore chapters anytime: <a href="https://abigailstocks.com/podcast" style="color: #319795; text-decoration: underline;">Listen on abigailstocks.com/podcast</a>.</p>
    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
    <p style="font-size: 14px; color: #718096; margin-bottom: 4px;">Warmly,</p>
    <p style="font-size: 15px; font-weight: bold; color: #1A365D; margin: 0;">Abigail Stocks</p>
    <p style="font-size: 13px; color: #718096; margin: 0;">Habit & Mindset Coach &bull; <a href="https://abigailstocks.com" style="color: #319795;">abigailstocks.com</a></p>
</div>`;
        } else {
            return res.status(400).json({ success: false, error: 'Invalid enquiry type specified.' });
        }

        // Call Resend API via native fetch
        // Note: onboarding@resend.dev only allows sending to the single account email; BCC is added when custom domain is verified
        const isTestingDomain = senderFrom.includes('resend.dev');
        const resendPayload = {
            from: senderFrom,
            to: [email],
            subject: subject,
            text: textContent,
            html: htmlContent
        };

        if (!isTestingDomain) {
            resendPayload.bcc = [abiEmail, helloEmail];
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resendPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend API Error:', data);
            return res.status(response.status).json({ success: false, error: data.message || 'Error sending email.' });
        }

        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Unexpected serverless function error:', err);
        return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
    }
}
