<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Minesweeper</title>
    <link rel="shortcut icon"
          href="${pageContext.request.contextPath}/resources/img/favicon.ico"
          type="image/x-icon"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/home.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/stopwatch.css">
</head>
<body>
<!-- partial:index.partial.html -->
<div id="options">
    <div id="title">Options</div>
    <div id="optionsChild" class="option">
        <div class="option">
            <label>
                <input id="easy" type="button" value="Easy"/>
                <input id="medium" type="button" value="Medium"/>
                <input id="hard" type="button" value="Hard"/>
            </label>
            <label style="margin-top: 0.5em">
                <input id="custom" type="button" value="Custom"/>
            </label>
        </div>
        <div id="ifCustom">
            <div class="option">
                <label>
                    <input id="board-size-x" type="number" value="10" min="2" max="128"/>
                    <div class="title">Board size X</div>
                </label>
            </div>
            <div class="option">
                <label>
                    <input id="board-size-y" type="number" value="10" min="2" max="128"/>
                    <div class="title">Board size Y</div>
                </label>
            </div>
            <div class="option">
                <label>
                    <input id="mine-count" type="number" value="10" min="1" max="16383"/>
                    <div class="title">Mine count</div>
                </label>
            </div>
            <div class="option">
                <label>
                    <input id="setup-game" type="button" value="Setup game"/>
                </label>
            </div>
        </div>
    </div>
</div>
<jsp:include page="navbar.jsp"/>
<div>
    <div id="canvasContainer">
        <canvas id="canvas"></canvas>
    </div>
    <div id="stopwatch">
        <div class="stopwatch"></div>
    </div>
</div>

<script>
    window.canvasOptions = {
        autoClear: true,
        autoCompensate: false,
        autoPushPop: true,
        canvas: true,
        centered: true,
        width: null,
        height: null
    };
    /* requestAnimationFrame */
    const contextPath = "${pageContext.request.contextPath}";
</script>
<!-- partial -->
<script src="${pageContext.request.contextPath}/resources/js/stopwatch.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/home.js"></script>
</body>
</html>
