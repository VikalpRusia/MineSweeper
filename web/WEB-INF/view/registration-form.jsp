<%--
  Created by IntelliJ IDEA.
  User: vikal
  Date: 24-09-2021
  Time: 20:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<html>
<head>
    <title>Registration-Form</title>
</head>
<body>
<form:form modelAttribute="newPlayer" action="processForm" method="post">
    Name: <form:input path="name"/>
    <br><br>
    <input type="submit" value="Submit">
</form:form>
</body>
</html>
