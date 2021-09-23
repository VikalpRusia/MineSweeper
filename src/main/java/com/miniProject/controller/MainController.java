package com.miniProject.controller;

import com.miniProject.entity.Level;
import com.miniProject.entity.Player;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Collections;

@Controller
public class MainController {
    private ArrayList<Player> arrayList_easy;
    private ArrayList<Player> arrayList_medium;
    private ArrayList<Player> arrayList_hard;

    public MainController() {
    }

    @RequestMapping("/")
    @ResponseBody
    public String sample(){
        return "hi";
    }


    @RequestMapping("/highScore/{level}")
    public String getTop10(@PathVariable("level") Level level, Model model){
        if (level==Level.Easy){
            model.addAttribute("list", Collections.unmodifiableList(arrayList_easy));
        }else if (level==Level.Medium){
            model.addAttribute("list",Collections.unmodifiableList(arrayList_medium));
        } else{
            model.addAttribute("list",Collections.unmodifiableList(arrayList_hard));
        }
        return "highScore";
    }
}
