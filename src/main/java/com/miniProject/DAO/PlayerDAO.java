package com.miniProject.DAO;


import com.miniProject.entity.Player;

import java.util.List;

public interface PlayerDAO {
    List<Player> getAllPlayer();

    Player isPlayerRegistered(String userName, String password);

    void savePlayer(Player player);

    void deletePlayer(Player player);

    void updatePlayer(Player player);

    boolean checkUserNameExists(String userName);
}
