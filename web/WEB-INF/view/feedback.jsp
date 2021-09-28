<%--
  Created by IntelliJ IDEA.
  User: vikal
  Date: 28-09-2021
  Time: 09:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CodePen - Feedback Reactions (Dark version)</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/feedback.css">

</head>
<body>
<!-- partial:index.partial.html -->
<div class="feedback">
    <label class="angry">
        <input type="radio" value="1" name="feedback"/>
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
        <input type="radio" value="2" name="feedback"/>
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
        <input type="radio" value="3" name="feedback"/>
        <div></div>
    </label>
    <label class="good">
        <input type="radio" value="4" name="feedback" checked/>
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
        <input type="radio" value="5" name="feedback"/>
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
<!-- partial -->
<script src="${pageContext.request.contextPath}/resources/js/feedback.js"></script>
</body>
</html>
