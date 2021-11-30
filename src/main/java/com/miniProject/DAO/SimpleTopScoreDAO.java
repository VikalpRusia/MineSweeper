package com.miniProject.DAO;

import com.miniProject.entity.Level;
import com.miniProject.entity.PlayerScore;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.PriorityQueue;

@Repository
public class SimpleTopScoreDAO implements TopScoreDAO {
    private final SessionFactory sessionFactory;

    @Autowired
    public SimpleTopScoreDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Transactional
    @Override
    public PriorityQueue<PlayerScore> getTop10Players(Level level) {
        Session currentSession = sessionFactory.getCurrentSession();
        Query<PlayerScore> query =
                currentSession.createQuery("From PlayerScore p " +
                        "where p.playerScorePk.level=:level order by time", PlayerScore.class);
        query.setMaxResults(10);
        query.setParameter("level", level);
        return new PriorityQueue<>(query.getResultList());
    }

    @Transactional
    @Override
    public PriorityQueue<PlayerScore> getLeaderBoard(Level level, int page, int page_data) {
        Session currentSession = sessionFactory.getCurrentSession();
        Query<PlayerScore> query =
                currentSession.createQuery("From PlayerScore p " +
                        "where p.playerScorePk.level=:level order by time", PlayerScore.class);
        query.setFirstResult((page - 1) * page_data);
        query.setMaxResults(page_data);
        query.setParameter("level", level);
        return new PriorityQueue<>(query.getResultList());
    }
}
