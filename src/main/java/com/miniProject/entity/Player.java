package com.miniProject.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.*;

@Entity
@Table(name = "players")
public class Player implements Externalizable {
    @Serial
    private static final long serialVersionUID = 4638201649372946388L;

    @Id
    @Column
    private String name;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(name);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        name = (String) in.readObject();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Player p1) {
            return this.name.equals(p1.name);
        }
        return false;
    }

    @Override
    public String toString() {
        return "Player{" +
                "name='" + name + '\'' +
                '}';
    }
}
