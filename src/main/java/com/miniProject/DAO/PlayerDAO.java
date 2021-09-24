package com.miniProject.DAO;


import com.miniProject.entity.Level;
import com.miniProject.entity.Player;

import java.util.PriorityQueue;

public interface PlayerDAO {
    PriorityQueue<Player> getTop10Players(Level level);
}
