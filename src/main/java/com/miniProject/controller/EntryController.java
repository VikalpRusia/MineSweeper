package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

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
    @ResponseBody
    public String sample() {
        return playerDAO.getAllPlayer().toString();
    }

    @GetMapping("/register")
    public String displayRegistrationForm(Model model) {
        model.addAttribute("newPlayer", new Player());
        return "registration-form";
    }

    @PostMapping("/process-form")
    public String processRegistrationForm(@Valid @ModelAttribute("newPlayer") Player newPlayer,
                                          BindingResult result) {
        if (result.hasErrors()) {
            return "registration-form";
        } else {
            playerDAO.savePlayer(newPlayer);
            return "redirect:log-in";
        }
    }

    @GetMapping("/log-in")
    public String logIn(HttpSession session) {
        if (session.getAttribute("player") == null) {
            return "log-in";
        } else {
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
