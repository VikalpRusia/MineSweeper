package com.miniProject.services;

import org.springframework.scheduling.annotation.Async;

import java.util.concurrent.CompletableFuture;

@Async
public interface MailServices {
    CompletableFuture<Boolean> sendMail(String username, String recipient, String heading, String content);

    CompletableFuture<Boolean> sendVerificationMail(String username, String recipient);
}
