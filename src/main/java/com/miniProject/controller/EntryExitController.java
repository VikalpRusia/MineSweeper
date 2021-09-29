package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Feedback;
import com.miniProject.entity.Player;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PostMapping("/set-feedback")
    public void feedback(@RequestBody String jsonString, HttpSession session) {
        JSONObject jsonObject = new JSONObject(jsonString);
        Feedback feedback = Feedback.valueOf(jsonObject.getString("feedback"));
        if (session.getAttribute("player") instanceof Player p) {
            p.setFeedback(feedback);
            playerDAO.updatePlayer(p);
        }
    }

    @ResponseBody
    @GetMapping(value = "/get-feedback", produces = "application/json; charset=utf-8")
    public String getFeedback(HttpSession session) {
        JSONObject jsonObject = new JSONObject();
        if (session.getAttribute("player") instanceof Player p && p.getFeedback() != null) {
            jsonObject.put("feedback", p.getFeedback());
        } else {
            jsonObject.put("feedback", Feedback.GOOD);
        }
        return jsonObject.toString();
    }
}
