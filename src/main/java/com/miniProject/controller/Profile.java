package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Player;
import com.miniProject.services.LoadUploadFiles;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/profile")
public class Profile {
    private static final Logger logger = LogManager.getLogger(Profile.class);
    private PlayerDAO playerDAO;
    private LoadUploadFiles loadUploadFiles;

    @Autowired
    public void setUploadingFiles(LoadUploadFiles loadUploadFiles) {
        this.loadUploadFiles = loadUploadFiles;
    }

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
    }

    @GetMapping()
    public String getProfilePage(HttpSession session, Model model) {
        logger.atInfo().log("Request at /profile");
        if (session.getAttribute("player") instanceof Player p) {
            model.addAttribute("player", p);
            return "profile";
        } else {
            logger.atWarn().log("User not logged in");
            logger.atInfo().log("redirecting to: " + "/");
            return "redirect:/";
        }
    }

    @ResponseBody
    @PostMapping("/update-password")
    public String updatePassword(@RequestBody String jsonString, HttpSession session) {
        JSONObject jsonObject = new JSONObject(jsonString);
        JSONObject returnJson = new JSONObject();
        if (session.getAttribute("player") instanceof Player player) {
            if (player.getPassword().equals(jsonObject.getString("currentPass"))) {
                player.setPassword(jsonObject.getString("newPass"));
                playerDAO.updatePlayer(player);
                returnJson.put("isPasswordChanged", true);
            } else {
                returnJson.put("isPasswordChanged", false);
            }
        } else {
            returnJson.put("isPasswordChanged", (String) null);
        }
        return returnJson.toString();
    }

    @ResponseBody
    @PostMapping(value = "/upload-avtar")
    public String upload(@RequestPart("img") MultipartFile img, HttpSession session) {
        JSONObject returnJson = new JSONObject();
        returnJson.put("isDataChanged", (String) null);
        if (session.getAttribute("player") instanceof Player player &&
                img.getOriginalFilename() != null) {
            returnJson.put("isDataChanged",
                    loadUploadFiles.saveFile(img, session.getServletContext().getRealPath(""),
                            player.getUserName()));
        }
        return returnJson.toString();
    }

    @ResponseBody
    @GetMapping(value = "/load-avtar/{userName}", produces = "image/webp")
    public byte[] load(@PathVariable("userName") String userName, HttpSession session) {
        return loadUploadFiles.loadFile(session.getServletContext().getRealPath(""),
                userName);
    }

    @ResponseBody
    @PostMapping("/{data-change}")
    public String updateData(@RequestBody String jsonString, HttpSession session,
                             @PathVariable("data-change") String toBeChanged) {
        JSONObject jsonObject = new JSONObject(jsonString);
        JSONObject returnJson = new JSONObject();
        returnJson.put("isDataChanged", (String) null);
        if (session.getAttribute("player") instanceof Player player) {
            returnJson.put("isDataChanged", false);
            switch (toBeChanged) {
                case "change-email" -> player.setEmail(jsonObject.getString("data"));
                case "change-username" -> player.setUserName(jsonObject.getString("data"));
                case "change-full-name" -> player.setFullName(jsonObject.getString("data"));
                default -> {
                    return returnJson.toString();
                }
            }
            playerDAO.updatePlayer(player);
            returnJson.put("isDataChanged", true);
        }
        return returnJson.toString();
    }
}
