<%--
  Created by IntelliJ IDEA.
  User: vikalp
  Date: 24-09-2021
  Time: 20:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html>
<head>
    <title>Registration-Form</title>
</head>
<body>
<form:form modelAttribute="newPlayer" action="processForm" method="post">
    User Name: <form:input path="userName"/>
    <form:errors path="userName"/>
    <br><br>
    Name: <form:input path="fullName"/>
    <form:errors path="fullName"/>
    <br><br>
    Password: <form:password path="password"/>
    <form:errors path="password"/>
    <input type="submit" value="Submit">
</form:form>
</body>
</html>
