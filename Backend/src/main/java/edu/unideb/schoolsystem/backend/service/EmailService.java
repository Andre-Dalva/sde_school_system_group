package edu.unideb.schoolsystem.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendVerificationCode(String to, Long id, String code) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Your Teacher Verification Code");
        msg.setText("Hello," +
                "\nTo log in you need to go to this address:" +
                "http://localhost:8080/users/" + id +
                "/verify?" + "code=" + code +
                "\n This is your teacher ID:" + id +
                "\nYour verification code is: " + code);
        javaMailSender.send(msg);
    }
}
