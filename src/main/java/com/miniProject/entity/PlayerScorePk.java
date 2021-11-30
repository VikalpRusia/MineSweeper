package com.miniProject.entity;

import javax.persistence.*;
import java.io.*;

@Embeddable
public class PlayerScorePk implements Externalizable {
    @Serial
    private static final long serialVersionUID = 17654235627723478L;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "Fk_player_username"))
    private Player player;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "level")
    private Level level;

    public PlayerScorePk(Player player, Level level) {
        this.player = player;
        this.level = level;
    }

    public PlayerScorePk() {
    }

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

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof PlayerScorePk pk) {
            return pk.player.equals(this.player) && pk.level.equals(this.level);
        }
        return false;
    }
}
