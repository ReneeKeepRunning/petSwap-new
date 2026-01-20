const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Message from ${name} (${email}): ${message}`);

    const msg = {
        to: 'tongruiyi1997@gmail.com',
        from: 'tongruiyi1997@gmail.com',
        subject: `New Contact Request from ${name}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
        html: `
            <h1>New Contact Request</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    };

    try {
        console.log('Sending email with the following message:');
        console.log(msg);
        await sgMail.send(msg);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
    }
});

module.exports = router;
