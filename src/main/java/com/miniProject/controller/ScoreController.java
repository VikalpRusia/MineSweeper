package com.miniProject.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
@RequestMapping("/score")
public class ScoreController {
    private static final Logger logger = LogManager.getLogger(ScoreController.class);

    @PostMapping("/collect")
    @ResponseStatus(HttpStatus.OK)
    public void getScore(@RequestBody String jsonString) {
        logger.atInfo().log("Request at: /score/collect");
        logger.atDebug().log("request body: {}", jsonString);
        JSONObject jsonObject = new JSONObject(jsonString);
        System.out.println(jsonString);
        JSONArray time = jsonObject.getJSONArray("time");
    }
}
