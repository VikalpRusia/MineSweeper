package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Feedback;
import com.miniProject.entity.Player;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    private static final Logger logger = LogManager.getLogger(FeedbackController.class);
    PlayerDAO playerDAO;

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
        logger.atDebug().log("PlayerDAO set");
    }

    @GetMapping(produces = "application/json; charset=utf-8")
    public String getFeedback(HttpSession session) {
        logger.atDebug().log("Old feedback requested");
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
        logger.atDebug().log("Beacon request received for saving feedback");
        JSONObject jsonObject = new JSONObject(jsonString);
        Feedback feedback = Feedback.valueOf(jsonObject.getString("feedback"));
        if (session.getAttribute("player") instanceof Player p) {
            logger.atDebug().log("player found in session");
            p.setFeedback(feedback);
            playerDAO.updatePlayer(p);
        }
    }
}
