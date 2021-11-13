<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Minesweeper</title>
    <link rel="shortcut icon"
          href="${pageContext.request.contextPath}/resources/img/favicon.ico"
          type="image/x-icon"/>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/home.css">

</head>
<body>
<!-- partial:index.partial.html -->
<div id="options">
    <div id="title">Options</div>
    <div class="option">
        <div id="custom">
            <label>
                <input id="board-size-x" type="number" value="16" min="2" max="128"/>
                <div class="title">Board size X</div>
            </label>
        </div>
        <div class="option">
            <label>
                <input id="board-size-y" type="number" value="16" min="2" max="128"/>
                <div class="title">Board size Y</div>
            </label>
        </div>
        <div class="option">
            <label>
                <input id="mine-count" type="number" value="40" min="1" max="16383"/>
                <div class="title">Mine count</div>
            </label>
        </div>
    </div>
    <div class="option">
        <label>
            <input id="setup-game" type="button" value="Setup game"/>
        </label>
    </div>
</div>
<div class="option">
    <label>
        <input id="smoothed-mouse-tracking" type="checkbox" checked="checked"/>
        <div class="title">Smoothed mouse tracking</div>
    </label>
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
</script>
<!-- partial -->
<script src="${pageContext.request.contextPath}/resources/js/home.js"></script>

</body>
</html>
