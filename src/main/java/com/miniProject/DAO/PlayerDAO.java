package com.miniProject.DAO;


import com.miniProject.entity.Player;

import java.util.List;

public interface PlayerDAO {
    List<Player> getAllPlayer();

    Player isPlayerRegistered(String userName, String password);

    boolean savePlayer(Player player);

    boolean deletePlayer(Player player);
}
