package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Player;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

//creating session is a better option here
@Controller
public class EntryExitController {
    private PlayerDAO playerDAO;

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
    }

    @GetMapping("/")
    public String entry(Model model, HttpSession session) {
        model.addAttribute("newPlayer", new Player());
        return "entry";
    }

    @PostMapping("/sign-up-form")
    public String processRegistrationForm(@ModelAttribute("newPlayer") Player newPlayer) {
        playerDAO.savePlayer(newPlayer);
        return "entry";
    }

    @ResponseBody
    @PostMapping("/verify-log-in")
    public String verifyLogIn(@RequestBody String jsonString, HttpSession session) {
        JSONObject jsonObject = new JSONObject(jsonString);
        String userName = jsonObject.getString("userName");
        String password = jsonObject.getString("password");
        Player player = playerDAO.isPlayerRegistered(userName, password);
        if (player == null) {
            return "{\"validUser\": \"false\"}";
        } else {
            session.setAttribute("player", player);
            return "{\"validUser\": \"true\"}";
        }
    }

    @GetMapping("/log-out")
    public String logOut() {
        return "feedback";
    }

    @PostMapping("/feedback")
    public void feedback(@RequestBody String jsonString) {
        JSONObject jsonObject = new JSONObject(jsonString);
        String feedback = jsonObject.getString("feedback");

    }
}
