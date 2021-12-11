<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/navbar.css">
<div class="navbar">
    <div class="left">
        <ul>
            <li><a id="homeButton" href="${pageContext.request.contextPath}/home">Home</a></li>
            <li><a id="leaderboardButton" href="${pageContext.request.contextPath}/leaderboard">Leaderboard</a></li>
            <li><a id="feedbackButton" href="${pageContext.request.contextPath}/show-feedback-form">Feedback</a></li>
        </ul>
    </div>
    <div class="right">
        <ul>
            <li><a href="${pageContext.request.contextPath}/log-out">Log Out</a></li>
        </ul>
    </div>
</div>