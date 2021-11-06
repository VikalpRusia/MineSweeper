package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Feedback;
import com.miniProject.entity.Player;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("/log-out")
public class ExitController {
    private static final Logger logger = LogManager.getLogger(ExitController.class);
    PlayerDAO playerDAO;
    private Player player;

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
        logger.atDebug().log("PlayerDAO set");
    }

    @GetMapping()
    public String logOut(HttpServletResponse response, HttpServletRequest request, HttpSession session) throws IOException {
        logger.atInfo().log("Request at /log-out");
        if (session.getAttribute("player") instanceof Player p) {
            player = p;
            session.invalidate();
            return "feedback";
        }
        response.sendRedirect(request.getContextPath() + "/");
        return null;
    }

    @ResponseBody
    @GetMapping(value = "/feedback", produces = "application/json; charset=utf-8")
    public String getFeedback() {
        logger.atDebug().log("Old feedback requested");
        JSONObject jsonObject = new JSONObject();
        if (player != null && player.getFeedback() != null) {
            jsonObject.put("feedback", player.getFeedback());
        } else {
            jsonObject.put("feedback", Feedback.GOOD);
        }
        return jsonObject.toString();
    }

    @ResponseStatus(HttpStatus.ACCEPTED)
    @PostMapping("/feedback")
    public void feedback(@RequestBody String jsonString) {
        logger.atDebug().log("Beacon request received for saving feedback");
        JSONObject jsonObject = new JSONObject(jsonString);
        Feedback feedback = Feedback.valueOf(jsonObject.getString("feedback"));
        if (player != null) {
            logger.atDebug().log("player found in session");
            player.setFeedback(feedback);
            playerDAO.updatePlayer(player);
        }
    }
}
