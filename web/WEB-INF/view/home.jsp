<%--
  Created by IntelliJ IDEA.
  User: vikal
  Date: 25-09-2021
  Time: 17:29
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Home</title>
    <link rel="shortcut icon"
          href="${pageContext.request.contextPath}/resources/img/favicon.ico"
          type="image/x-icon"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/home.css"/>
</head>
<body>
<div id="Main-logo">Mine<span>Sweeper</span></div>
<div id="dataBody">
    <input type="radio" id="Easy" name="level" value="Easy">
    <label for="Easy">EASY</label><br>
    <input type="radio" id="Medium" name="level" value="Medium">
    <label for="Medium">MEDIUM</label><br>
    <input type="radio" id="Hard" name="level" value="Hard">
    <label for="Hard">HARD</label>
    <br>
    <button type="button" onclick="createGame()">Start Button</button>
</div>
<script src="${pageContext.request.contextPath}/resources/js/home.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
        integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI="
        crossorigin="anonymous"></script>
</body>
</html>
