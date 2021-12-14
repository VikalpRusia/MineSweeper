<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="shortcut icon"
          href="${pageContext.request.contextPath}/resources/img/favicon.ico"
          type="image/x-icon"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/profile.css">
    <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.0.10/css/all.css'>
    <title>Profile Settings</title>
</head>
<body>
<script>const contextPath = "${pageContext.request.contextPath}"</script>
<!-- partial:index.partial.html -->
<jsp:include page="navbar.jsp"/>
<div class="container">
    <div id="logo"><h1 class="logo">Minesweeper</h1>
        <div class="CTA">
            <h1><a href="mailto:18bcs163@ietdavv.edu.in?subject=Report Bug">Contact Us</a></h1>
        </div>
    </div>

    <div class="leftbox">
        <nav>
            <a id="profile" class="active"><i class="fa fa-user"></i></a>
            <a id="password"><i class="fas fa-lock"></i></a>
        </nav>
    </div>
    <div class="rightbox">
        <div class="profile">
            <h1>Personal Info</h1>
            <h2>User Name</h2>
            <p><input id="username" type="text" placeholder="User Name" value="${player.userName}">
                <button id="usernameBtn" class="btn">update</button>
            </p>
            <h2>Full Name</h2>
            <p><input id="fullName" type="text" placeholder="Full Name" value="${player.fullName}">
                <button id="fullNameBtn" class="btn">update</button>
            </p>
            <h2>Email</h2>
            <p><input id="email" type="text" placeholder="Email" value="${player.email}">
                <button id="emailBtn" class="btn">update</button>
            </p>
        </div>

        <div class="password noshow">
            <h1>Change Password</h1>
            <h2>Current Password </h2>
            <p><input id="currentPass" type="password" placeholder="Current Password" required>
            </p>
            <h2>New Password</h2>
            <p><input id="newPass" type="password" placeholder="New Password" required>
            </p>
            <h2>Retype New Password</h2>
            <p><input id="retypePass" type="password" placeholder="Retyped Password" required>
            </p>
            <h2 id="report-error" class="error"></h2>
            <button id="changePassword" class="btn">Change</button>
        </div>
    </div>
</div>

<!-- partial -->
<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>
<script src="${pageContext.request.contextPath}/resources/js/profile.js"></script>
</body>
</html>
