package com.miniProject.controller;

import com.miniProject.DAO.TopScoreDAO;
import com.miniProject.entity.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/leaderboard")
public class Leaderboard {
    private static final Logger logger = LogManager.getLogger(Leaderboard.class);
    private TopScoreDAO playerScoreDAO;

    @Autowired
    public void setPlayerScoreDAO(TopScoreDAO playerScoreDAO) {
        this.playerScoreDAO = playerScoreDAO;
        logger.atDebug().log("set PlayerDAO");
    }

    @GetMapping("/{level}")
    public String getTop10(@PathVariable("level") Level level, Model model) {
        logger.atInfo().log("Request at /high-score/{}", level);
        model.addAttribute("list", playerScoreDAO.getTop10Players(level));
        return "leaderboard";
    }

    @GetMapping("")
    public String getPlayerHighScore() {
        logger.atInfo().log("Request at /leaderboard");
        return "redirect:/leaderboard/EASY";
    }
}
