package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Player;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sign-up-form")
public class PlayerRegistration {
    private static final Logger logger = LogManager.getLogger(PlayerRegistration.class);
    private final PlayerDAO playerDAO;

    @Autowired
    public PlayerRegistration(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
    }

    @PostMapping()
    public String processRegistrationForm(@ModelAttribute("newPlayer") Player newPlayer) {
        JSONObject jsonObject = new JSONObject();
        playerDAO.savePlayer(newPlayer);
        jsonObject.put("success", true);
        logger.atDebug().log("Registered new player");
        return jsonObject.toString();
    }

    @PostMapping("/is-username-available")
    public String isUsernameAvailable(@RequestBody String jsonString) {
        JSONObject returnJson = new JSONObject();
        JSONObject jsonObject = new JSONObject(jsonString);
        String userName = jsonObject.getString("userName");
        returnJson.put("present", playerDAO.checkUserNameExists(userName));
        return returnJson.toString();
    }

    @PostMapping("/is-email-available")
    public String isEmailAvailable(@RequestBody String jsonString) {
        JSONObject returnJson = new JSONObject();
        JSONObject jsonObject = new JSONObject(jsonString);
        String userName = jsonObject.getString("email");
        returnJson.put("present", playerDAO.checkEmailExists(userName));
        return returnJson.toString();
    }
}
