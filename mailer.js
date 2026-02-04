const nodemailer = require('nodemailer');

/**
 * Sends a high-quality PDF report via Gmail SMTP.
 */
async function sendPDFReport(to_email, pdfBase64, summaryData) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"SAFE Calculator" <${process.env.GMAIL_USER}>`,
        to: to_email,
        subject: 'Your SAFE Calculator Report',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                <h2 style="color: #5F17EA;">SAFE Calculator Report</h2>
                <p>Hello,</p>
                <p>Here is your calculation summary:</p>
                <div style="background: #f8f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Founder Ownership:</strong> ${summaryData.founderOwnership}</li>
                        <li><strong>Dilution:</strong> ${summaryData.founderDilution}</li>
                        <li><strong>Post-Money Valuation:</strong> ${summaryData.postMoney}</li>
                    </ul>
                </div>
                <p>Please find the detailed PDF report attached.</p>
                <br/>
                <p style="color: #666; font-size: 13px;">Best regards,<br/>SAFE Calculator Team</p>
            </div>
        `,
        attachments: [
            {
                filename: `SAFE_Report_${new Date().toISOString().split('T')[0]}.pdf`,
                content: pdfBase64,
                encoding: 'base64',
                contentType: 'application/pdf'
            }
        ]
    };

    return await transporter.sendMail(mailOptions);
}

module.exports = { sendPDFReport };

