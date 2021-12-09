package com.miniProject.DAO;

import com.miniProject.entity.Player;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class SimplePlayerDAO implements PlayerDAO {
    private final SessionFactory sessionFactory;

    @Autowired
    public SimplePlayerDAO(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Transactional
    @Override
    public List<Player> getAllPlayer() {
        Session currentSession = sessionFactory.getCurrentSession();
        Query<Player> query = currentSession.createQuery("From Player", Player.class);
        return query.getResultList();
    }

    @Transactional
    @Override
    public Player isPlayerRegistered(String userName, String password) {
        Session currentSession = sessionFactory.getCurrentSession();
        Query<Player> query = currentSession.createQuery(
                "FROM Player p WHERE p.userName=:userName AND p.password=:password", Player.class);
        query.setParameter("userName", userName);
        query.setParameter("password", password);
        return query.uniqueResult();
    }

    @Transactional
    @Override
    public void savePlayer(Player player) {
        Session currentSession = sessionFactory.getCurrentSession();
        currentSession.save(player);
    }

    @Transactional
    @Override
    public void deletePlayer(Player player) {
        Session currentSession = sessionFactory.getCurrentSession();
        currentSession.delete(player);
    }

    @Transactional
    @Override
    public void updatePlayer(Player player) {
        Session currentSession = sessionFactory.getCurrentSession();
        currentSession.update(player);
    }

    @Transactional
    @Override
    public boolean checkUserNameExists(String userName) {
        Session currentSession = sessionFactory.getCurrentSession();
        Query<Player> query =
                currentSession.createQuery(
                        "FROM Player p WHERE p.userName=:username", Player.class);
        query.setParameter("username", userName);
        return query.uniqueResult() != null;
    }
}
