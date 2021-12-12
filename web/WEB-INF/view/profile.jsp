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
<!-- partial:index.partial.html -->
<jsp:include page="navbar.jsp"/>
<div class="container">
    <div id="logo"><h1 class="logo">Minesweeper</h1>
        <div class="CTA">
            <h1>Get $10</h1>
        </div>
    </div>

    <div class="leftbox">
        <nav>
            <a id="profile" class="active"><i class="fa fa-user"></i></a>
            <a id="payment"><i class="fa fa-credit-card"></i></a>
        </nav>
    </div>
    <div class="rightbox">
        <div class="profile">
            <h1>Personal Info</h1>
            <h2>Full Name</h2>
            <p>Julie Park
                <button class="btn">update</button>
            </p>
            <h2>Email</h2>
            <p>example@example.com
                <button class="btn">update</button>
            </p>
            <h2>Password </h2>
            <p>•••••••
                <button class="btn">Change</button>
            </p>
        </div>

        <div class="payment noshow">
            <h1>Payment Info</h1>
            <h2>Payment Method</h2>
            <p>Mastercard •••• •••• •••• 0000
                <button class="btn">update</button>
            </p>
            <h2>Billing Address</h2>
            <p>1234 Example Ave | Seattle, WA
                <button class="btn">change</button>
            </p>
            <h2>Zipcode</h2>
            <p>999000</p>
            <h2>Billing History</h2>
            <p>2018
                <button class="btn">view</button>
            </p>
            <h2>Redeem Gift Subscription </h2>
            <p><input type="text" placeholder="Enter Gift Code"></input>
                <button class="btn">Redeem</button>
            </p>
        </div>
    </div>
</div>

<!-- partial -->
<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>
<script src="${pageContext.request.contextPath}/resources/js/profile.js"></script>
</body>
</html>
