package com.miniProject.entity;

public enum Level {
    Easy, Medium, Hard;


    public static int compare(Level o1, Level o2) {
        return (o1 == Level.Easy ? 1 : o1 == Level.Medium ? 2 : 3) -
                (o2 == Level.Easy ? 1 : o1 == Level.Medium ? 2 : 3);
    }
}
