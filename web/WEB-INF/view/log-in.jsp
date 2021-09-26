<%--
  Created by IntelliJ IDEA.
  User: vikal
  Date: 25-09-2021
  Time: 17:40
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Log-in</title>
</head>
<body>
<form method="post" action="verify-log-in">
    <label for="userName">User Name:</label><br>
    <input type="text" id="userName" name="userName"><br>
    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password"><br>
    <input type="submit" value="Submit">
</form>

</body>
</html>
