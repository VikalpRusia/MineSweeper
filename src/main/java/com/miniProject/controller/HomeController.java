package com.miniProject.controller;

import com.miniProject.entity.Player;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("/home")
public class HomeController {
    private static final Logger logger = LogManager.getLogger(HomeController.class);


    @GetMapping("")
    public String homePage(HttpSession session) throws IOException {
        logger.atInfo().log("Request at /home");
        if (session.getAttribute("player") instanceof Player) {
            return "home";
        } else {
            logger.atInfo().log("User not logged in");
            logger.atInfo().log("redirecting to: " + "/");
            return "redirect:/";
        }

    }
}
