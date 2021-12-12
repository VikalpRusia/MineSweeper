<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Feedback Reactions (Dark version)</title>
    <link rel="shortcut icon"
          href="${pageContext.request.contextPath}/resources/img/favicon.ico"
          type="image/x-icon"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/feedback.css">
</head>
<body>
<!-- partial:index.partial.html -->
<c:if test="${loggedIn==true}">
    <jsp:include page="navbar.jsp"/>
</c:if>
<div class="emojiContainer">
    <div class="feedback">
        <label class="angry">
            <input type="radio" value="ANGRY" name="feedback"/>
            <div>
                <svg class="eye left">
                    <use xlink:href="#eye">
                </svg>
                <svg class="eye right">
                    <use xlink:href="#eye">
                </svg>
                <svg class="mouth">
                    <use xlink:href="#mouth">
                </svg>
            </div>
        </label>
        <label class="sad">
            <input type="radio" value="SAD" name="feedback"/>
            <div>
                <svg class="eye left">
                    <use xlink:href="#eye">
                </svg>
                <svg class="eye right">
                    <use xlink:href="#eye">
                </svg>
                <svg class="mouth">
                    <use xlink:href="#mouth">
                </svg>
            </div>
        </label>
        <label class="ok">
            <input type="radio" value="OK" name="feedback"/>
            <div></div>
        </label>
        <label class="good">
            <input type="radio" value="GOOD" name="feedback"/>
            <div>
                <svg class="eye left">
                    <use xlink:href="#eye">
                </svg>
                <svg class="eye right">
                    <use xlink:href="#eye">
                </svg>
                <svg class="mouth">
                    <use xlink:href="#mouth">
                </svg>
            </div>
        </label>
        <label class="happy">
            <input type="radio" value="HAPPY" name="feedback"/>
            <div>
                <svg class="eye left">
                    <use xlink:href="#eye">
                </svg>
                <svg class="eye right">
                    <use xlink:href="#eye">
                </svg>
            </div>
        </label>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 4" id="eye">
            <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 7" id="mouth">
            <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
        </symbol>
    </svg>
</div>
<!-- partial -->
<script src="${pageContext.request.contextPath}/resources/js/feedback.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
        integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI="
        crossorigin="anonymous"></script>
<script>
    const contextPath = "${pageContext.request.contextPath}";
</script>
</body>
</html>
