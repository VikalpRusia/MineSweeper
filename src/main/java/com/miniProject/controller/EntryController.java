package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

//creating session is a better option here
@Controller
public class EntryController {
    private PlayerDAO playerDAO;

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
    }

    @GetMapping("/")
    public String entry() {
        return "entry";
    }

    @PostMapping("/process-form")
    public String processRegistrationForm(@Valid @ModelAttribute("newPlayer") Player newPlayer,
                                          BindingResult result) {
        if (result.hasErrors()) {
            return "entry";
        } else {
            playerDAO.savePlayer(newPlayer);
            return "home";
        }
    }

    @PostMapping("/verify-log-in")
    public String verifyLogIn(@RequestParam String userName,
                              @RequestParam String password, HttpSession session) {
        Player player = playerDAO.isPlayerRegistered(userName, password);
        if (player == null) {
            throw new RuntimeException("Player not registered");
        } else {
            session.setAttribute("player", player);
            return "home";
        }
    }
}
