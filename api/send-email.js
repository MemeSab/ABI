// Vercel Serverless Function: /api/send-email
export default async function handler(req, res) {
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
        let headerTag = 'Coaching Enquiry';
        let emailTitle = '';
        let bodyHtml = '';
        let textContent = '';

        // Helper function: Wrap into Abigail Stocks Brand Template
        const renderBrandEmail = (tag, title, content) => {
            return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abigail Stocks Coaching</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #2C2D2B;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FAF7F2; padding: 36px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #EBE5DA; overflow: hidden; box-shadow: 0 4px 20px rgba(63, 75, 60, 0.05);">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="padding: 34px 24px 22px; border-bottom: 1px solid #F0ECE4; background-color: #FFFFFF;">
              <a href="https://abigailstocks.com" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="https://abigailstocks.com/assets/logo-header.png" alt="Abigail Stocks Coaching" width="210" style="display: block; border: 0; max-width: 210px; height: auto;" />
              </a>
              <div style="margin-top: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #A5736C; font-weight: 600;">
                Healthy Habits Coaching for Real Life
              </div>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 34px 32px 28px; color: #2C2D2B; font-size: 15px; line-height: 1.65;">
              
              <!-- Tag Pill -->
              <div style="display: inline-block; background-color: #F7ECEB; color: #A5736C; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px;">
                ${tag}
              </div>

              <!-- Main Heading -->
              <h1 style="font-family: Georgia, 'Cormorant Garamond', serif; font-size: 24px; font-weight: 500; color: #3F4B3C; margin: 0 0 16px; line-height: 1.3;">
                ${title}
              </h1>

              <!-- Dynamic Email Body -->
              ${content}

              <!-- Abigail Signature Block with Photo -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #F0ECE4;">
                <tr>
                  <td width="60" valign="middle" style="padding-right: 14px;">
                    <img src="https://abigailstocks.com/assets/abigail_actual.jpg" alt="Abigail Stocks" width="52" height="52" style="border-radius: 50%; display: block; border: 2px solid #EBE5DA; object-fit: cover;" />
                  </td>
                  <td valign="middle">
                    <p style="margin: 0; font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #3F4B3C;">Abigail Stocks</p>
                    <p style="margin: 2px 0 0; font-size: 13px; color: #5F615C;">Habit & Mindset Coach &bull; <a href="https://abigailstocks.com" style="color: #A5736C; text-decoration: none; font-weight: 500;">abigailstocks.com</a></p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #FBF9F5; padding: 20px 24px; border-top: 1px solid #EBE5DA; font-size: 12px; color: #8C8E89; line-height: 1.5;">
              <p style="margin: 0 0 4px;">Abigail Stocks Coaching &bull; Personalised Habit & Lifestyle Coaching</p>
              <p style="margin: 0;">Have a question? Simply reply directly to this email or write to <a href="mailto:hello@abigailstocks.com" style="color: #3F4B3C; text-decoration: underline;">hello@abigailstocks.com</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
        };

        if (type === 'package') {
            const pkg = packageName || 'Initial Coaching Call';
            headerTag = 'Coaching Programme Enquiry';

            if (pkg === 'Initial Coaching Call' || pkg === 'Single Habit Reset') {
                subject = 'Your Initial Coaching Call Details - Abigail Stocks Coaching';
                emailTitle = `Hi ${clientName},`;

                textContent = `Hi ${clientName},

Thank you for enquiring about the Initial Coaching Call with Abigail Stocks Coaching!

Here is what is included in your 60-minute session:
• 60 Mins dedicated 1:1 coaching session
• Explore your goals, understand personal challenges & blocks
• Actionable next steps & personalized habit guidance
• Understand if 1:1 coaching is the right fit for your journey

Investment: £45 (One-off session)

Ready to begin? Simply reply directly to this email or write to hello@abigailstocks.com to arrange your session date and time.

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

                bodyHtml = `
<p style="margin-top: 0;">Thank you for enquiring about the <strong>Initial Coaching Call</strong>. Whether you're looking to reset your routines, overcome a specific hurdle, or explore if coaching is right for you, this session is designed to give you clarity and direction.</p>

<div style="background-color: #F8FAF8; border-left: 4px solid #3F4B3C; border-radius: 8px; padding: 20px; margin: 24px 0;">
  <h3 style="margin: 0 0 12px; font-family: Georgia, serif; font-size: 17px; color: #3F4B3C;">What's Included in Your 1:1 Session:</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.7; color: #2C2D2B;">
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td><strong>60 Mins</strong> dedicated 1:1 coaching session via video call</td></tr>
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td>Current routine audit & deep-dive into your personal challenges</td></tr>
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td>Actionable habit blueprint & realistic next steps</td></tr>
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td>Explore if a structured coaching pathway is right for you</td></tr>
  </table>

  <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #EBE5DA;">
    <span style="display: inline-block; background-color: #F7ECEB; color: #A5736C; font-size: 15px; font-weight: 700; padding: 6px 14px; border-radius: 8px;">
      Investment: £45 <span style="font-size: 13px; font-weight: normal; color: #5F615C;">(One-off session)</span>
    </span>
  </div>
</div>

<div style="margin: 28px 0 20px;">
  <a href="mailto:hello@abigailstocks.com?subject=Booking%20Initial%20Coaching%20Call" style="display: inline-block; background-color: #3F4B3C; color: #FFFFFF; font-weight: 600; font-size: 15px; text-decoration: none; padding: 12px 26px; border-radius: 8px;">Reply to Book Your Session &rarr;</a>
</div>

<p style="font-size: 14px; color: #5F615C; margin-bottom: 0;">Have any questions first? Simply hit reply to this email and I will gladly help!</p>`;

            } else if (pkg === '6-Week Coaching Programme' || pkg === '6-Session Momentum') {
                subject = 'Your 6-Week Coaching Programme Details - Abigail Stocks Coaching';
                emailTitle = `Hi ${clientName},`;

                textContent = `Hi ${clientName},

Thank you for enquiring about the 6-Week Coaching Programme with Abigail Stocks Coaching!

Here is what is included in your structured programme:
• 6 × 60-Minute dedicated 1:1 coaching sessions (weekly rhythm)
• Structured roadmap to build confidence, set habits & make steady progress
• Mindset & movement worksheets & tailored guides
• Direct email support & accountability between sessions

Investment: £250 package price (regular £270)

Ready to begin? Simply reply directly to this email or write to hello@abigailstocks.com to secure your spot.

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

                bodyHtml = `
<p style="margin-top: 0;">Thank you for enquiring about the <strong>6-Week Coaching Programme</strong>! This structured pathway is designed to help you build confidence, set sustainable health rhythms, and build self-trust with consistent 1:1 guidance.</p>

<div style="background-color: #F8FAF8; border-left: 4px solid #3F4B3C; border-radius: 8px; padding: 20px; margin: 24px 0;">
  <h3 style="margin: 0 0 12px; font-family: Georgia, serif; font-size: 17px; color: #3F4B3C;">What's Included in Your 6-Week Pathway:</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.7; color: #2C2D2B;">
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td><strong>6 × 60-Minute</strong> dedicated 1:1 coaching sessions</td></tr>
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td>Weekly accountability check-ins & goal tracking</td></tr>
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td>Mindset & movement worksheets & tailored guides</td></tr>
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td>Direct email support & encouragement between calls</td></tr>
  </table>

  <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #EBE5DA;">
    <span style="display: inline-block; background-color: #F7ECEB; color: #A5736C; font-size: 15px; font-weight: 700; padding: 6px 14px; border-radius: 8px;">
      Investment: £250 Package Price <span style="font-size: 13px; font-weight: normal; color: #5F615C;">(regular £270 · Save £20)</span>
    </span>
  </div>
</div>

<div style="margin: 28px 0 20px;">
  <a href="mailto:hello@abigailstocks.com?subject=Booking%206-Week%20Coaching%20Programme" style="display: inline-block; background-color: #3F4B3C; color: #FFFFFF; font-weight: 600; font-size: 15px; text-decoration: none; padding: 12px 26px; border-radius: 8px;">Reply to Secure Your Spot &rarr;</a>
</div>

<p style="font-size: 14px; color: #5F615C; margin-bottom: 0;">Simply reply to this email with your preferred days/times, and we will get your first session scheduled!</p>`;

            } else {
                subject = 'Your 12-Week Coaching Programme Details - Abigail Stocks Coaching';
                emailTitle = `Hi ${clientName},`;

                textContent = `Hi ${clientName},

Thank you for enquiring about the 12-Week Coaching Programme with Abigail Stocks Coaching!

Here is what is included in your comprehensive programme:
• 12 × 60-Minute deep-dive 1:1 sessions (weekly rhythm)
• Complete habit transformation roadmap for deep progress and lasting change
• Ongoing priority message & direct email support between sessions
• Custom wellness logs, personalized reflection tools & continuous accountability

Investment: £495 package price (regular £540)

Ready to begin? Simply reply directly to this email or write to hello@abigailstocks.com to secure your spot.

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

                bodyHtml = `
<p style="margin-top: 0;">Thank you for enquiring about the <strong>12-Week Coaching Programme</strong>! This is my deepest and most comprehensive pathway, created for full lifestyle shifts, sustained habit change, and lasting wellness.</p>

<div style="background-color: #F8FAF8; border-left: 4px solid #3F4B3C; border-radius: 8px; padding: 20px; margin: 24px 0;">
  <h3 style="margin: 0 0 12px; font-family: Georgia, serif; font-size: 17px; color: #3F4B3C;">What's Included in Your Full Transformation:</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.7; color: #2C2D2B;">
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td><strong>12 × 60-Minute</strong> deep-dive 1:1 coaching sessions</td></tr>
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td>Complete habit transformation roadmap for lasting change</td></tr>
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td>Ongoing priority message & direct email support between sessions</td></tr>
    <tr><td width="22" valign="top" style="color: #3F4B3C; font-weight: bold;">✓</td><td>Custom wellness logs, personalized reflection tools & weekly accountability</td></tr>
  </table>

  <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #EBE5DA;">
    <span style="display: inline-block; background-color: #F7ECEB; color: #A5736C; font-size: 15px; font-weight: 700; padding: 6px 14px; border-radius: 8px;">
      Investment: £495 Package Price <span style="font-size: 13px; font-weight: normal; color: #5F615C;">(regular £540 · Save £45)</span>
    </span>
  </div>
</div>

<div style="margin: 28px 0 20px;">
  <a href="mailto:hello@abigailstocks.com?subject=Booking%2012-Week%20Coaching%20Programme" style="display: inline-block; background-color: #3F4B3C; color: #FFFFFF; font-weight: 600; font-size: 15px; text-decoration: none; padding: 12px 26px; border-radius: 8px;">Reply to Secure Your Spot &rarr;</a>
</div>

<p style="font-size: 14px; color: #5F615C; margin-bottom: 0;">Ready to embark on this journey? Hit reply to confirm your start date and times!</p>`;
            }

        } else if (type === 'resource') {
            headerTag = 'Free Wellness Resource';
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
            emailTitle = `Hi ${clientName},`;

            textContent = `Hi ${clientName},

Thank you for downloading the ${resTitle} from Abigail Stocks Coaching!

Here are your direct access links:
• Download Printable PDF: ${pdfLink}
• Open Interactive Web Version: ${webLink}

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

            bodyHtml = `
<p style="margin-top: 0;">Thank you for downloading the <strong>${resTitle}</strong>! Small, sustainable steps are the foundation of real wellness.</p>

<div style="background-color: #F8FAF8; border: 1px solid #EBE5DA; border-radius: 12px; padding: 22px; margin: 24px 0; text-align: center;">
  <p style="margin: 0 0 16px; font-weight: 600; color: #3F4B3C;">Access Your Resource Instantly:</p>
  <a href="${pdfLink}" style="display: inline-block; background-color: #3F4B3C; color: #FFFFFF; font-weight: 600; font-size: 14px; text-decoration: none; padding: 11px 22px; border-radius: 8px; margin-bottom: 12px;">📥 Download Printable PDF</a>
  <div>
    <a href="${webLink}" style="color: #A5736C; font-size: 13px; font-weight: 600; text-decoration: underline;">📱 Open Interactive Web Version &rarr;</a>
  </div>
</div>

<p style="font-size: 14px; color: #5F615C; margin-bottom: 0;">Whenever you're ready for 1:1 guidance to fast-track your health habits, you can always write to me at <a href="mailto:hello@abigailstocks.com" style="color: #3F4B3C;">hello@abigailstocks.com</a>.</p>`;

        } else if (type === 'contact') {
            headerTag = 'Message Received';
            subject = 'Thank you for reaching out - Abigail Stocks Coaching';
            emailTitle = `Hi ${clientName},`;

            textContent = `Hi ${clientName},

Thank you for getting in touch with Abigail Stocks Coaching!

I have received your message and will get back to you personally within 24-48 business hours.

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

            bodyHtml = `
<p style="margin-top: 0;">Thank you for getting in touch! I have received your message and will get back to you personally within 24–48 business hours.</p>
<p>Whether you have a question about one of our coaching programmes, daily habit routines, or wellness tips, I look forward to speaking with you.</p>`;

        } else if (type === 'waitlist') {
            headerTag = 'The Strive Podcast';
            subject = "You're on the list! - The Strive Podcast with Abigail Stocks";
            emailTitle = `Hi ${clientName},`;

            textContent = `Hi ${clientName},

Thank you for joining the waitlist for The Strive Podcast with Abigail Stocks!

You'll be the first to know as soon as full episodes drop. In the meantime, listen to the preview audio at https://abigailstocks.com/podcast.

Warmly,
Abigail Stocks
Habit & Mindset Coach
https://abigailstocks.com`;

            bodyHtml = `
<p style="margin-top: 0;">Thank you for joining the waitlist for <strong>The Strive Podcast</strong>! You'll be the first to receive updates when full episodes launch, along with exclusive subscriber habit guides.</p>
<div style="margin: 22px 0;">
  <a href="https://abigailstocks.com/podcast" style="display: inline-block; background-color: #3F4B3C; color: #FFFFFF; font-weight: 600; font-size: 14px; text-decoration: none; padding: 11px 22px; border-radius: 8px;">Listen to Preview Episode &rarr;</a>
</div>`;
        }

        const fullHtml = renderBrandEmail(headerTag, emailTitle, bodyHtml);

        const isTestingDomain = senderFrom.includes('resend.dev');
        const resendPayload = {
            from: senderFrom,
            to: [email],
            subject: subject,
            text: textContent,
            html: fullHtml
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
