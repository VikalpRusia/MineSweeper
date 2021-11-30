package com.miniProject.DAO;

import com.miniProject.entity.Level;
import com.miniProject.entity.Player;

public interface PlayerScoreDAO {

    boolean saveScore(Player player, Level level, double time);

    boolean addTimeLoose(Player player, Level level, double time);
}
