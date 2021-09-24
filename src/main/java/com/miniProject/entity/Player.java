package com.miniProject.entity;

import javax.persistence.*;
import java.io.*;

@Entity
@Table(name = "Players", indexes = @Index(name = "highScore", columnList = "level, time ASC ,name ASC"))
public class Player implements Comparable<Player>, Externalizable {
    @Serial
    private static final long serialVersionUID = 4638201649372946388L;

    @Id
    @Column
    private String name;
    @Column
    private long time;
    @Enumerated(EnumType.ORDINAL)
    @Column
    private Level level;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    @Override
    public int compareTo(Player o) {
        if (this.level != o.level){
            return Level.compare(o.level,this.level);
        }
        return Long.compare(this.time,o.time);
    }

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(name);
        out.writeObject(time);
        out.writeObject(level);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        name=(String)in.readObject();
        time=in.readLong();
        level=(Level)in.readObject();
    }

    @Override
    public String toString() {
        return "Player{" +
                "name='" + name + '\'' +
                ", time=" + time +
                ", level=" + level +
                '}';
    }
}
