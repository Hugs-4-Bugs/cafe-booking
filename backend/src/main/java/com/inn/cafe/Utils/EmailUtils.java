package com.inn.cafe.Utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.List;

@Service
public class EmailUtils {

    @Autowired
    private JavaMailSender emailSender;


    /**
     * 1. `to`: The recipient's email address.
     * 2. `subject`: The subject line of the email.
     * 3. `text`: The body content of the email (text).
     * 4. `list`: A list of attachments to be included in the email. *
     */
    public void sendSimpleMessage(String to, String subject, String text, List<String> list) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("kattyboy785@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        if (list != null && list.size() > 0)
            message.setCc(getCcArray(list));
        emailSender.send(message);
    }

    private String[] getCcArray(List<String> ccList) {
        String[] cc = new String[ccList.size()];
        for (int i = 0; i < ccList.size(); i++) {
            cc[i] = ccList.get(i);
        }
        return cc;
    }

/** The `forgotMail` method is used to send an email containing the user's login credentials (email and password) when they request a password reset, ensuring they can log in again. */
    public void forgotMail(String to, String subject, String password) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom("kattyboy785@gmail.com");
        helper.setTo(to);
        message.setSubject(subject);
        String htmlMsg = "<p><b>Your Login details for Cafe Management System</b><br><b>Email: </b> " + to + " <br><b>Password: </b> " + password + "<br><a href=\"http://localhost:4200/\">Click here to login</a></p>";
        message.setContent(htmlMsg, "text/html");
        emailSender.send(message);
    }
}





/**
 * This class is used to send emails in the Cafe application.
 * It has methods to send simple emails, emails with attachments, and emails with login details for password reset.
 *
 * The goal is to keep all email-related code in one place so it can be used easily whenever needed.
 *
 * Key Methods:
 * - `sendSimpleMessage`: Sends a basic email with a subject and message, and can include attachments.
 * - `forgotMail`: Sends an email with the user's login details (email and password) when they reset their password.
 */

/**
 * The purpose of creating a separate `EmailUtils` class is to organize all the email-related functionality in one place.
 * Instead of writing email sending logic in multiple places, we keep it here so that:
 * 1. The code is cleaner and easier to manage.
 * 2. We can reuse the email sending methods throughout the application without repeating the same code.
 * 3. If we need to change how emails are sent, we can do it in one place, making updates faster and less error-prone.
 */
