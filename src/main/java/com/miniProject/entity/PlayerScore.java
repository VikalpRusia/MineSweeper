package com.miniProject.entity;

import javax.persistence.*;
import java.io.*;

@Entity
@Table(name = "playerScores", indexes = @Index(name = "highScore", columnList = "level,time"))
public class PlayerScore implements Comparable<PlayerScore>, Externalizable {

    @Serial
    private static final long serialVersionUID = 1547236472549265528L;

    @EmbeddedId
    private PlayerScorePk playerScorePk;
    @Column(name = "time")
    private long time;

    @Column(name = "totalTime")
    private long totalTime;

    @Column(name = "gamePlayed")
    private int gamePlayed;

    public long getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(long totalTime) {
        this.totalTime = totalTime;
    }

    public int getGamePlayed() {
        return gamePlayed;
    }

    public void setGamePlayed(int gamePlayed) {
        this.gamePlayed = gamePlayed;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public Level getLevel() {
        return playerScorePk.getLevel();
    }

    public void setLevel(Level level) {
        this.playerScorePk.setLevel(level);
    }

    @Override
    public int compareTo(PlayerScore o) {
        if (this.getLevel() != o.getLevel()) {
            return Level.compare(o.getLevel(), this.getLevel());
        }
        return Long.compare(this.time, o.time);
    }

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(playerScorePk);
        out.writeLong(time);
        out.writeLong(totalTime);
        out.writeInt(gamePlayed);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        playerScorePk = (PlayerScorePk) in.readObject();
        time = in.readLong();
        totalTime = in.readLong();
        gamePlayed = in.readInt();
    }

    @Override
    public String toString() {
        return "PlayerScore{" +
                "playerScorePk=" + playerScorePk +
                ", time=" + time +
                ", totalTime=" + totalTime +
                ", gamePlayed=" + gamePlayed +
                '}';
    }

    @Embeddable
    private static class PlayerScorePk implements Externalizable {
        @Serial
        private static final long serialVersionUID = 17654235627723478L;
        @ManyToOne
        private Player player;
        @Enumerated(EnumType.ORDINAL)
        @Column(name = "level")
        private Level level;

        public Player getPlayer() {
            return player;
        }

        public void setPlayer(Player player) {
            this.player = player;
        }

        public Level getLevel() {
            return level;
        }

        public void setLevel(Level level) {
            this.level = level;
        }

        @Override
        public void writeExternal(ObjectOutput out) throws IOException {
            out.writeObject(player);
            out.writeObject(level);
        }

        @Override
        public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
            player = (Player) in.readObject();
            level = (Level) in.readObject();
        }

        @Override
        public String toString() {
            return "PlayerScorePk{" +
                    "player=" + player +
                    ", level=" + level +
                    '}';
        }
    }
}
