package com.miniProject.entity;

public enum Level {
    EASY, MEDIUM, HARD;


    public static int compare(Level o1, Level o2) {
        return (o1 == Level.EASY ? 1 : o1 == Level.MEDIUM ? 2 : 3) -
                (o2 == Level.EASY ? 1 : o1 == Level.MEDIUM ? 2 : 3);
    }
}
