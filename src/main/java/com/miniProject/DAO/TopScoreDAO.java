package com.miniProject.DAO;

import com.miniProject.entity.Level;
import com.miniProject.entity.PlayerScore;

import java.util.ArrayList;

public interface TopScoreDAO {
    ArrayList<PlayerScore> getTop10Players(Level level);

    ArrayList<PlayerScore> getLeaderBoard(Level level, int page, int page_data);
}
