<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Leaderboard</title>
    <link rel="shortcut icon"
          href="${pageContext.request.contextPath}/resources/img/favicon.ico"
          type="image/x-icon"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/leaderboard.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/navbar.css">
</head>
<body>
<!-- partial:index.partial.html -->
<div class="navbar">
    <div class="left">
        <ul>
            <li><a href="${pageContext.request.contextPath}/home/">Home</a></li>
            <li><a class="active">Leaderboard</a></li>
            <li><a href="${pageContext.request.contextPath}/show-feedback-form">Feedback</a></li>
        </ul>
    </div>
    <div class="right">
        <ul>
            <li><a href="${pageContext.request.contextPath}/log-out">Log Out</a></li>
        </ul>
    </div>
</div>
<div class="center">
    <div class="top3">
        <c:if test="${list.size()>1}">
            <div class="two item">
                <div class="pos">
                    2
                </div>
                <div class="pic"
                     style="background-image: url(&#39;https://randomuser.me/api/portraits/men/44.jpg&#39;)"></div>
                <div class="name">
                    <c:out value="${list.get(1).playerScorePk.player.userName}"/>
                </div>
                <div class="score">
                    <fmt:formatNumber type="number"
                                      minFractionDigits="2" maxFractionDigits="2" value="${list.get(1).bestTime/100}"/>
                </div>
            </div>
        </c:if>
        <c:if test="${list.size()>0}">
            <div class="one item">
                <div class="pos">
                    1
                </div>
                <div class="pic"
                     style="background-image: url(&#39;https://randomuser.me/api/portraits/men/31.jpg&#39;)"></div>
                <div class="name">
                    <c:out value="${list.get(0).playerScorePk.player.userName}"/>
                </div>
                <div class="score">
                    <fmt:formatNumber type="number"
                                      minFractionDigits="2" maxFractionDigits="2"
                                      value="${list.get(0).bestTime/100}"/></div>
            </div>
        </c:if>
        <c:if test="${list.size()>2}">
            <div class="three item">
                <div class="pos">
                    3
                </div>
                <div class="pic"
                     style="background-image: url(&#39;https://randomuser.me/api/portraits/women/91.jpg&#39;)"></div>
                <div class="name">
                    <c:out value="${list.get(2).playerScorePk.player.userName}"/>
                </div>
                <div class="score">
                    <fmt:formatNumber type="number"
                                      minFractionDigits="2" maxFractionDigits="2"
                                      value="${list.get(2).bestTime/100}"/></div>
            </div>
        </c:if>
    </div>

    <div class="list">
        <c:forEach items="${list}" var="item" varStatus="i">
            <c:if test="${i.index>2}">
                <div class="item">
                    <div class="pos">
                        <c:out value="${i.index+1}"/>
                    </div>
                    <div class="pic"
                         style="background-image: url(&#39;https://randomuser.me/api/portraits/men/88.jpg&#39;)"></div>
                    <div class="name">
                        <c:out value="${item.playerScorePk.player.userName}"/>
                    </div>
                    <div class="score">
                        <fmt:formatNumber type="number"
                                          minFractionDigits="2" maxFractionDigits="2"
                                          value="${item.bestTime/100}"/></div>
                </div>
            </c:if>
        </c:forEach>
    </div>
</div>


<!-- partial -->
</body>
</html>
