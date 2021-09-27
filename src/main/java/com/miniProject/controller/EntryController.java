package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;

//creating session is a better option here
@Controller
public class EntryController {
    private PlayerDAO playerDAO;

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
    }

    @GetMapping("/")
    public String entry(Model model) {
        model.addAttribute("newPlayer", new Player());
        return "entry";
    }

    @PostMapping("/sign-up-form")
    public String processRegistrationForm(@ModelAttribute("newPlayer") Player newPlayer) {
        playerDAO.savePlayer(newPlayer);
        return "entry";
    }

    @PostMapping("/verify-log-in")
    public String verifyLogIn(@RequestParam String userName,
                              @RequestParam String password, HttpSession session) {
        Player player = playerDAO.isPlayerRegistered(userName, password);
        if (player == null) {
            return "redirect:/";
        } else {
            session.setAttribute("player", player);
            return "home";
        }
    }
}
