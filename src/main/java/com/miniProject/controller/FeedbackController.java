package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Player;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    PlayerDAO playerDAO;

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
    }

    @GetMapping(produces = "application/json; charset=utf-8")
    public String getFeedback(HttpSession session) {
        JSONObject jsonObject = new JSONObject();
        if (session.getAttribute("player") instanceof Player p && p.getFeedback() != null) {
            jsonObject.put("feedback", p.getFeedback());
        } else {
            jsonObject.put("feedback", com.miniProject.entity.Feedback.GOOD);
        }
        return jsonObject.toString();
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PostMapping
    public void feedback(@RequestBody String jsonString, HttpSession session) {
        JSONObject jsonObject = new JSONObject(jsonString);
        com.miniProject.entity.Feedback feedback = com.miniProject.entity.Feedback.valueOf(jsonObject.getString("feedback"));
        if (session.getAttribute("player") instanceof Player p) {
            p.setFeedback(feedback);
            playerDAO.updatePlayer(p);
        }
    }
}
