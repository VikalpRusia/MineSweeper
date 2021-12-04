package com.miniProject.entity;

import javax.persistence.*;
import java.io.*;

@Entity
@Table(name = "playerScores", indexes = @Index(name = "highScore", columnList = "level,bestTime"))
public class PlayerScore implements Comparable<PlayerScore>, Externalizable {

    @Serial
    private static final long serialVersionUID = 1547236472549265528L;
    @EmbeddedId
    private PlayerScorePk playerScorePk;
    @Column(name = "bestTime", precision = 2)
    private Double bestTime;
    @Column(name = "totalTime")
    private Double totalTime;
    @Column(name = "gamePlayed")
    private int gamePlayed;

    public PlayerScore() {
    }

    public PlayerScore(PlayerScorePk playerScorePk, double bestTime) {
        this.playerScorePk = playerScorePk;
        this.bestTime = bestTime;
        this.totalTime = bestTime;
        this.gamePlayed = 1;
    }

    public PlayerScore(PlayerScorePk playerScorePk) {
        this.playerScorePk = playerScorePk;
        this.totalTime = 0D;
        this.bestTime = null;
    }

    public PlayerScorePk getPlayerScorePk() {
        return playerScorePk;
    }

    public Double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(Double totalTime) {
        this.totalTime = totalTime;
    }

    public void addTime(double totalTime) {
        this.totalTime += totalTime;
        this.gamePlayed += 1;
    }

    public int getGamePlayed() {
        return gamePlayed;
    }

    public void setGamePlayed(int gamePlayed) {
        this.gamePlayed = gamePlayed;
    }

    public Double getBestTime() {
        return bestTime;
    }

    public void setBestTime(Double time) {
        this.bestTime = time;
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
        return Double.compare(this.bestTime, o.bestTime);
    }

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(playerScorePk);
        out.writeDouble(bestTime);
        out.writeDouble(totalTime);
        out.writeInt(gamePlayed);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        playerScorePk = (PlayerScorePk) in.readObject();
        bestTime = in.readDouble();
        totalTime = in.readDouble();
        gamePlayed = in.readInt();
    }

    @Override
    public String toString() {
        return "PlayerScore{" +
                "playerScorePk=" + playerScorePk +
                ", time=" + bestTime +
                ", totalTime=" + totalTime +
                ", gamePlayed=" + gamePlayed +
                '}';
    }
}
