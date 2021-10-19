module MineSweeper {
    requires java.persistence;
    requires spring.web;
    requires spring.context;
    requires org.hibernate.orm.core;
    requires spring.beans;
    requires spring.tx;
    requires transitive java.naming;
    requires javax.servlet.api;
    requires org.json;
    requires org.apache.logging.log4j;
}