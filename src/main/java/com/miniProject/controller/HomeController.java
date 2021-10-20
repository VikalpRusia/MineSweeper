package com.miniProject.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/home")
public class HomeController {
    private static final Logger logger = LogManager.getLogger(EntryExitController.class);


    @GetMapping("")
    public String homePage() {
        logger.atInfo().log("Request at /home");
        return "home";
    }
}
