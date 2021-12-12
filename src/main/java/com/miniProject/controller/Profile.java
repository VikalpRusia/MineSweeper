package com.miniProject.controller;

import com.miniProject.entity.Player;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/profile")
public class Profile {
    private static final Logger logger = LogManager.getLogger(Profile.class);

    @GetMapping()
    public String getProfilePage(HttpSession session) {
        logger.atInfo().log("Request at /profile");
        if (session.getAttribute("player") instanceof Player) {
            return "profile";
        } else {
            logger.atWarn().log("User not logged in");
            logger.atInfo().log("redirecting to: " + "/");
            return "redirect:/";
        }
    }
}
