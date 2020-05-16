const nodemailer = require('nodemailer');
const user = process.env.EMAIL;
const pass = process.env.PASS;

const mail = async reqBody => {
    let transporter = nodemailer.createTransport({
        host: 'whatsupchickenbutt.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user, // generated ethereal user
            pass, // generated ethereal password
        },
        tls: { rejectUnauthorized: false },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Website Contact Form" <silvio@whatsupchickenbutt.com>`, // sender address
        to: 's.ciarro@gmail.com', // list of receivers
        subject: reqBody.subject, // Subject line
        html: `
            <p>You have a new contact request</p>
                <h3>Contact Details</h3>
                <ul>  
                    <li>Name: ${reqBody.name}</li>
                    <li>Email: ${reqBody.email}</li>
                </ul>
                <h3>Message</h3>
            <p>${reqBody.message}</p>
        `, // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

module.exports = mail;
