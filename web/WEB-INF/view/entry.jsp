<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%--
  Created by IntelliJ IDEA.
  User: vikal
  Date: 26-09-2021
  Time: 15:52
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <script
            src="https://kit.fontawesome.com/64d58efce2.js"
            crossorigin="anonymous"
    ></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css"/>
    <title>Sign in & Sign up Form</title>
</head>
<body>
<div class="container">
    <div class="forms-container">
        <div class="signin-signup">
            <form action="verify-log-in" method="post" class="sign-in-form"
                  onsubmit="return validateSignInForm()" id="signInForm">
                <h2 class="title">Sign in</h2>
                <div class="input-field">
                    <i class="fas fa-user"></i>
                    <input type="text" placeholder="Username" name="userName" required>
                </div>
                <div class="input-field">
                    <i class="fas fa-lock"></i>
                    <input type="password" placeholder="Password" name="password" required>
                </div>
                <input type="submit" value="Login" class="btn solid"/>
                <p class="social-text">Or Sign in with social platforms</p>
                <div class="social-media">
                    <a href="#" class="social-icon">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="social-icon">
                        <i class="fab fa-google"></i>
                    </a>
                </div>
            </form>
            <form:form modelAttribute="newPlayer" action="sign-up-form" method="post"
                       class="sign-up-form" onsubmit="return validateSignUpForm()" id="signUpForm">
                <h2 class="title">Sign up</h2>
                <div class="input-field">
                    <i class="fas fa-user-circle"></i>
                    <form:input path="userName" placeholder="Username" required="required"/>
                </div>
                <div class="input-field">
                    <i class="fas fa-user"></i>
                    <form:input path="fullName" placeholder="Name" required="required"/>
                </div>
                <div class="input-field">
                    <i class="fas fa-lock"></i>
                    <form:password path="password" placeholder="Password" required="required"/>
                </div>
                <input type="submit" class="btn" value="Sign up"/>
                <p class="social-text">Or Sign up with social platforms</p>
                <div class="social-media">
                    <a href="#" class="social-icon">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="social-icon">
                        <i class="fab fa-google"></i>
                    </a>
                </div>
            </form:form>
        </div>
    </div>

    <div class="panels-container">
        <div class="panel left-panel">
            <div class="content">
                <h3>New here ?</h3>
                <p>
                    Join Minesweeper today.
                </p>
                <button class="btn transparent" id="sign-up-btn">
                    Sign up
                </button>
            </div>
            <img src="${pageContext.request.contextPath}/resources/img/log.svg" class="image" alt=""/>
        </div>
        <div class="panel right-panel">
            <div class="content">
                <h3>One of us ?</h3>
                <p>
                    Sign in to Minesweeper
                </p>
                <button class="btn transparent" id="sign-in-btn">
                    Sign in
                </button>
            </div>
            <img src="${pageContext.request.contextPath}/resources/img/register.svg" class="image" alt=""/>
        </div>
    </div>
</div>

<script src="${pageContext.request.contextPath}/resources/js/entry.js"></script>
</body>
</html>

