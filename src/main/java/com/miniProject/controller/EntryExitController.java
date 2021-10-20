package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Player;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

//creating Authentication token is a better option here
@Controller
public class EntryExitController {
    private PlayerDAO playerDAO;
    private static final Logger logger = LogManager.getLogger(EntryExitController.class);

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
        logger.atDebug().log("set playerDAO");
    }

    @GetMapping("/")
    public String entry(Model model, HttpSession session) {
        logger.atInfo().log("Request at /");
        model.addAttribute("newPlayer", new Player());
        logger.atDebug().log("model associated having instance of new player");
        return "entry";
    }

    @PostMapping("/sign-up-form")
    public String processRegistrationForm(@ModelAttribute("newPlayer") Player newPlayer) {
        playerDAO.savePlayer(newPlayer);
        logger.atDebug().log("Registered new player");
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
            logger.atWarn().log("User not registered or using invalid password");
            return "{\"validUser\": \"false\"}";
        } else {
            session.setAttribute("player", player);
            logger.atDebug().log("Player stored in session");
            return "{\"validUser\": \"true\"}";
        }
    }

    @GetMapping("/log-out")
    public String logOut() {
        logger.atInfo().log("Request at /log-out");
        return "feedback";
    }

}
