package com.miniProject.DAO;

import com.miniProject.entity.Level;
import com.miniProject.entity.Player;
import com.miniProject.entity.PlayerScore;
import com.miniProject.entity.PlayerScorePk;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class SimplePlayerScoreDAO implements PlayerScoreDAO {
    private final SessionFactory sessionFactory;

    @Autowired
    public SimplePlayerScoreDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Transactional
    @Override
    public boolean saveScore(Player player, Level level, double time) {
        Session currentSession = sessionFactory.getCurrentSession();
        PlayerScorePk pk = new PlayerScorePk(player, level);
        PlayerScore playerScore = currentSession.get(PlayerScore.class, pk);
        if (playerScore == null) {
            PlayerScore ps = new PlayerScore(new PlayerScorePk(player, level), time);
            currentSession.save(ps);
        } else {
            playerScore.addTime(time);
            if (playerScore.getBestTime() == null || playerScore.getBestTime() > time) {
                playerScore.setBestTime(time);
            }
        }
        return true;
    }

    @Transactional
    @Override
    public boolean addTimeLoose(Player player, Level level, double time) {
        Session currentSession = sessionFactory.getCurrentSession();
        PlayerScorePk pk = new PlayerScorePk(player, level);
        PlayerScore playerScore = currentSession.get(PlayerScore.class, pk);
        if (playerScore == null) {
            playerScore = new PlayerScore(new PlayerScorePk(player, level));
            currentSession.save(playerScore);
        }
        playerScore.addTime(time);
        return true;
    }

}
