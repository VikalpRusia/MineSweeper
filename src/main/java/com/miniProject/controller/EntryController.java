package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Player;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;

//creating Authentication token is a better option here
@Controller
public class EntryController {
    private static final Logger logger = LogManager.getLogger(EntryController.class);
    private PlayerDAO playerDAO;

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
        logger.atDebug().log("set playerDAO");
    }

    @GetMapping("/")
    public String entry(Model model, HttpSession session) {
        logger.atInfo().log("Request at /");
        if (session.getAttribute("player") == null) {
            model.addAttribute("newPlayer", new Player());
            logger.atDebug().log("model associated having instance of new player");
            return "entry";
        } else {
            return "redirect:/home";
        }
    }

    @ResponseBody
    @PostMapping("/verify-log-in")
    public String verifyLogIn(@RequestBody String jsonString, HttpSession session) {
        JSONObject jsonObject = new JSONObject(jsonString);
        JSONObject returnJson = new JSONObject();
        String userName = jsonObject.getString("userName");
        String password = jsonObject.getString("password");
        Player player = playerDAO.isPlayerRegistered(userName, password);
        if (player == null) {
            logger.atWarn().log("User not registered or using invalid password");
            returnJson.put("validUser", false);
        } else {
            session.setAttribute("player", player);
            logger.atDebug().log("Player stored in session");
            returnJson.put("validUser", true);
        }
        return returnJson.toString();
    }

    @ResponseBody
    @GetMapping("/user-verified")
    public String userStillLoggedIn(HttpSession session) {
        JSONObject returnJson = new JSONObject();
        returnJson.put("signedInUser", session.getAttribute("player") != null);
        return returnJson.toString();
    }
}
