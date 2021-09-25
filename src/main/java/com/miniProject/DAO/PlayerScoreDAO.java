package com.miniProject.DAO;

import com.miniProject.entity.Level;
import com.miniProject.entity.PlayerScore;

import java.util.PriorityQueue;

public interface PlayerScoreDAO {
    PriorityQueue<PlayerScore> getTop10Players(Level level);

    PriorityQueue<PlayerScore> getLeaderBoard(Level level, int page, int page_data);
}
