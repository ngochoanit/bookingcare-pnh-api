require("dotenv").config()
import nodemailer from 'nodemailer'
const sendSimpleEmail = async (dataSend) => {
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_APP, // generated ethereal user
                pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Booking Care" <${process.env.EMAIL_APP}>`, // sender address
            to: dataSend.reciverEmail, // list of receivers
            subject: "Thông Tin Đặt Lịch Khám Bệnh", // Subject line
            html: getBodyHtmlEmail(dataSend), // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    }

    main().catch(console.error);
}
const getBodyHtmlEmail = (dataSend) => {
    let result = ''
    if (dataSend && dataSend.language === "en") {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment on Booking Care</p>
        <p>Information to book a medical appointment:</p>
        <div><b>Time: ${dataSend.time}</b></div>    
        <div><b>Doctor: ${dataSend.doctorName}</b></div>    
        <i>If the above information matches your requirements, please click on the link below to confirm and complete the medical appointment booking procedure.</i>   
        <div><a href="${dataSend.redirectLink}" target="_blank">Click here</a></div>
        <div>Sincerely thank!</div>
        `
    }
    if (dataSend && dataSend.language === "vi") {
        result = `
        <h3>Xin Chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời Gian: ${dataSend.time}</b></div>    
        <div><b>Bác Sĩ: ${dataSend.doctorName}</b></div>    
        <i>Nếu các thông tin trên đúng với yêu cầu của bạn, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</i>   
        <div><a href="${dataSend.redirectLink}" target="_blank">Click here</a></div>
        <div>Xin chân thành cảm ơn!</div>
        `
    }
    return result
}
export const EmailService = {
    sendSimpleEmail
}