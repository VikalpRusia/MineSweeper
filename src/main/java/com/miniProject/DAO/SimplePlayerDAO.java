package com.miniProject.DAO;

import com.miniProject.entity.Level;
import com.miniProject.entity.Player;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.PriorityQueue;

@Repository
public class SimplePlayerDAO implements PlayerDAO {
    private final SessionFactory sessionFactory;

    @Autowired
    public SimplePlayerDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Transactional
    @Override
    public PriorityQueue<Player> getTop10Players(Level level) {
        Session currentSession = sessionFactory.getCurrentSession();
        Query<Player> query =
                currentSession.createQuery("From Player p where p.level= :level", Player.class);
        query.setMaxResults(10);
        query.setParameter("level", level);
        return new PriorityQueue<>(query.getResultList());

    }
}
