package com.miniProject.controller;

import com.miniProject.DAO.PlayerScoreDAO;
import com.miniProject.entity.Level;
import com.miniProject.entity.PlayerScore;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collections;
import java.util.PriorityQueue;

@Controller
@RequestMapping("/leaderboard")
public class Leaderboard {
    private PlayerScoreDAO playerScoreDAO;
    private PriorityQueue<PlayerScore> arrayList_easy;
    private PriorityQueue<PlayerScore> arrayList_medium;
    private PriorityQueue<PlayerScore> arrayList_hard;
    private static final Logger logger = LogManager.getLogger(Leaderboard.class);

    @Autowired
    public void setPlayerScoreDAO(PlayerScoreDAO playerScoreDAO) {
        this.playerScoreDAO = playerScoreDAO;
        logger.atDebug().log("set PlayerDAO");
    }

    @ResponseBody
    @GetMapping("/{level}")
    public String getTop10(@PathVariable("level") Level level, Model model) {
        logger.atInfo().log("Request at /high-score/{}", level);
        if (level == Level.EASY) {
            if (arrayList_easy == null) {
                arrayList_easy = playerScoreDAO.getTop10Players(level);
            }
            model.addAttribute("list",
                    Collections.unmodifiableCollection(arrayList_easy));
        } else if (level == Level.MEDIUM) {
            if (arrayList_medium == null) {
                arrayList_medium = playerScoreDAO.getTop10Players(level);
            }
            model.addAttribute("list",
                    Collections.unmodifiableCollection(arrayList_medium));
        } else {
            if (arrayList_hard == null) {
                arrayList_hard = playerScoreDAO.getTop10Players(level);
            }
            model.addAttribute("list",
                    Collections.unmodifiableCollection(arrayList_hard));
        }
        return model.getAttribute("list").toString();
    }

    @GetMapping("")
    public String getPlayerHighScore() {
        logger.atInfo().log("Request at /leaderboard");
        return "leaderboard";
    }
}
