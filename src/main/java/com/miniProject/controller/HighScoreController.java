package com.miniProject.controller;

import com.miniProject.DAO.PlayerScoreDAO;
import com.miniProject.entity.Level;
import com.miniProject.entity.PlayerScore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.PriorityQueue;

@Controller
@RequestMapping("/highScore")
public class HighScoreController {
    private PlayerScoreDAO playerScoreDAO;
    private PriorityQueue<PlayerScore> arrayList_easy;
    private PriorityQueue<PlayerScore> arrayList_medium;
    private PriorityQueue<PlayerScore> arrayList_hard;

    @Autowired
    public void setPlayerScoreDAO(PlayerScoreDAO playerScoreDAO) {
        this.playerScoreDAO = playerScoreDAO;
    }

    @ResponseBody
    @GetMapping("/{level}")
    public String getTop10(@PathVariable("level") Level level, Model model) {
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

    @ResponseBody
    @GetMapping("")
    public String getPlayerHighScore(@RequestParam("userName") String userName) {
        return userName;
    }
}
