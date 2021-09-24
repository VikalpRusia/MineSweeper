package com.miniProject.controller;

import com.miniProject.DAO.PlayerDAO;
import com.miniProject.entity.Level;
import com.miniProject.entity.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collections;
import java.util.PriorityQueue;

@Controller
public class MainController {
    private PriorityQueue<Player> arrayList_easy;
    private PriorityQueue<Player> arrayList_medium;
    private PriorityQueue<Player> arrayList_hard;
    private PlayerDAO playerDAO;

    @Autowired
    public void setPlayerDAO(PlayerDAO playerDAO) {
        this.playerDAO = playerDAO;
    }

    @GetMapping("/")
    @ResponseBody
    public String sample() {
        return playerDAO.getTop10Players(Level.Medium).toString();
    }

    @ResponseBody
    @GetMapping("/highScore/{level}")
    public String getTop10(@PathVariable("level") Level level, Model model) {
        if (level == Level.Easy) {
            if (arrayList_easy==null){
                arrayList_easy = playerDAO.getTop10Players(level);
            }
            model.addAttribute("list",
                    Collections.unmodifiableCollection(arrayList_easy));
        } else if (level == Level.Medium) {
            if (arrayList_medium==null){
                arrayList_medium = playerDAO.getTop10Players(level);
            }
            model.addAttribute("list",
                    Collections.unmodifiableCollection(arrayList_medium));
        } else {
            if (arrayList_hard==null){
                arrayList_hard = playerDAO.getTop10Players(level);
            }
            model.addAttribute("list",
                    Collections.unmodifiableCollection(arrayList_hard));
        }
        return level.toString();
    }
}
