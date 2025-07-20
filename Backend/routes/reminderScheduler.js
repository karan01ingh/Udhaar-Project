import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.js"; // Adjust path if needed
import Borrower from "../models/Borrower.js"; // Adjust path if needed
dotenv.config();

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Reminder Function
const sendReminders = async () => {
    // console.log("📬 Running sendReminders function...");
    try {
        const users = await User.find();
        for (const user of users) {
            const borrowers = await Borrower.find({
                lenderId: user._id,
                totalDue: { $gt: 0 }
            });
            // console.log(borrowers);
            // console.log("user mil gya ");
            for (const borrower of borrowers) {
                // console.log(`📨 Sending to: ${borrower.borrowerEmail}, due: ₹${borrower.totalDue}`);
                const mailOptions = {
                    from: `"${user.username} (via Udhaar App)" <${process.env.MAIL_USER}>`,
                    to: borrower.borrowerEmail,
                    replyTo: user.email,
                    subject: `⏰ Payment Due Reminder – ₹${borrower.totalDue}`,
                    html: `
                           <p>Hi ${borrower.borrowerName},</p>
                           <p>This is a friendly reminder from <strong>${user.username}</strong> (via Udhaar App).</p>
                           <p>You have an outstanding due of <strong>₹${borrower.totalDue}</strong>.</p>
                           <p>Please make the payment at your earliest convenience.</p>
                            <br>
                           <p>Thanks & Regards,<br/>Udhaar Team</p>
                            <hr>
                           <p style="font-size: 12px; color: #888;">
                               This is an automated message sent from the Udhaar App. Please do not reply to this email.
                           </p>  
                           `

                };
                // console.log("aa gya h yhn ");
                await transporter.sendMail(mailOptions);
                // console.log(`✅ Reminder sent to ${borrower.borrowerEmail}`);
            }
        }

    } catch (error) {
        console.error("❌ Error sending reminders:", error.message);
    }
};

// ⏰ Run every Sunday at 10 AM
cron.schedule("0 10 * * 0", sendReminders);
// cron.schedule("* * * * *", sendReminders);

// ✅ For testing (every minute)
// cron.schedule("* * * * *", sendReminders);
