<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CodePen - Swine Peeper</title>
    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport'/>
    <link href='https://fonts.googleapis.com/css?family=Sniglet:400,800' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/home.css">

</head>
<body>
<div id="loadingMessage">LOADING</div>
<div id="clickBlocker"></div>
<div id="jPlayer"></div>
<div id="jPlayer2"></div>
<div id="highScoreName" class="blueWindow"><strong class="enterName">ENTER YOUR NAME</strong>
    <div id="entryBoxes">
        <a id="previous" class="left" href="#">
            <br>&#x27a7;</a>
        <a id="next" href="#">
            <br>&#x27a7;</a>
        <div id="plusBox">
            <a class="up plusBox plus0" href="#">&#x27a7;</a>
            <a class="up plusBox plus1" href="#">&#x27a7;</a>
            <a class="up plusBox plus2" href="#">&#x27a7;</a>
            <a class="up plusBox plus3" href="#">&#x27a7;</a>
            <a class="up plusBox plus4" href="#">&#x27a7;</a>
            <a class="up plusBox plus5" href="#">&#x27a7;</a>
            <a class="up plusBox plus6" href="#">&#x27a7;</a>
            <a class="up plusBox plus7" href="#">&#x27a7;</a>
        </div>
        <div id="nameBox">
            <a class="nameBox character0" href="#"></a>
            <a class="nameBox character1" href="#"></a>
            <a class="nameBox character2" href="#"></a>
            <a class="nameBox character3" href="#"></a>
            <a class="nameBox character4" href="#"></a>
            <a class="nameBox character5" href="#"></a>
            <a class="nameBox character6" href="#"></a>
            <a class="nameBox character7" href="#"></a>
        </div>
        <div id="minusBox">
            <a class="down minusBox minus0" href="#">&#x27a7;</a>
            <a class="down minusBox minus1" href="#">&#x27a7;</a>
            <a class="down minusBox minus2" href="#">&#x27a7;</a>
            <a class="down minusBox minus3" href="#">&#x27a7;</a>
            <a class="down minusBox minus4" href="#">&#x27a7;</a>
            <a class="down minusBox minus5" href="#">&#x27a7;</a>
            <a class="down minusBox minus6" href="#">&#x27a7;</a>
            <a class="down minusBox minus7" href="#">&#x27a7;</a>
        </div>
    </div>
    <a id="clearName" class="circleButton" href="#">CLEAR</a>
    <a id="submitName" class="circleButton" href="#">SUBMIT</a>
</div>
<div id="customGameSetup" class="blueWindow">CUSTOM &nbsp;BOARD&nbsp; SETTINGS
    <br>
    <div class="counterPigBody custom">
        <br>&#x00b0;(oo)&#x00b0;
        <br>_
    </div>
    <div class="counterPigEar custom"></div>
    <div class="counterPigSpacer custom"></div>
    <div class="counterPigEar custom"></div>
    <div class="gameSquare custom"></div>
    <div id="customNumPigs"></div>
    <div id="customGridSize"></div>
    <div class="circleButton check">&#x2713;</div>
    <div class="circleButton x">&#x2717;</div>
    <div class="arrow plus pigNumber">&#x27a7;</div>
    <div class="arrow minus left pigNumber">&#x27a7;</div>
    <div class="arrow plus gridNumber">&#x27a7;</div>
    <div class="arrow minus left gridNumber">&#x27a7;</div>
</div>
<div id="rotatedBG"></div>
<div id="startMenu">
    <div id="gameLogo">MINE SWEEPER</div>
    <a class='startButton' id="easy" href="#">EASY</a>
    <a class='startButton' id="medium" href="#">MEDIUM</a>
    <a class='startButton' id="hard" href="#">HARD</a>
    <a class='startButton' id="custom" href="#">CUSTOM</a>
    <div style="alignment: center">
        <a class="circleButton instructionsButton" href="#">?</a>
        <a class="circleButton" id="highScores" href="#">&#x265a;</a>
    </div>
    <%--    <a class="circleButton soundButton" href="#">--%>
    <%--        <div class="speakerIcon"></div>--%>
    <%--    </a>--%>
    <%--    <a class="circleButton musicButton" href="#">--%>
    <%--        <div class="musicIcon">--%>
    <%--            <svg version="1.1" id="musicSVG" xmlns="http://www.w3.org/2000/svg"--%>
    <%--                 xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 375 375"--%>
    <%--                 style="enable-background:new 0 0 375 375;" xml:space="preserve">--%>
    <%--        <g>--%>
    <%--            <g>--%>
    <%--                <defs>--%>
    <%--                    <path id="SVGID_1_" d="M135.6,275.9c-14.4-6.9-27.4-10.3-39.1-10.3c-18.4,0-33.3,5.4-44.7,16c-11.4,10.7-17.1,23.9-17.1,39.6--%>
    <%--        				c0,14.8,4.7,26.8,14.3,36c9.5,9.2,22.4,13.8,38.7,13.8c13.8,0,26.5-3,38.2-9c11.7-6,19.9-14,24.7-24.1--%>
    <%--        				c4.8-10.1,7.2-24.2,7.2-42.3V108l133.6-41.5V229c-10.3-4.3-17.8-7-22.3-8.1c-4.6-1-9.8-1.6-15.8-1.6c-18.3,0-33.1,5.4-44.7,16.3--%>
    <%--        				c-11.5,10.9-17.3,23.8-17.3,38.7c0,14.8,4.9,26.9,14.6,36.3c9.7,9.4,22.7,14,39.1,14c14.2,0,27-3.1,38.3-9.2--%>
    <%--        				c11.3-6.1,19.3-13.9,24-23.3s7.1-23.4,7.1-42V1.4L135.6,57V275.9L135.6,275.9z"/>--%>
    <%--                </defs>--%>
    <%--                <clipPath id="SVGID_2_">--%>
    <%--                    <use xlink:href="#SVGID_1_" style="overflow:visible;"/>--%>
    <%--                </clipPath>--%>
    <%--                <g transform="matrix(1 0 0 1 0 0)" style="clip-path:url(#SVGID_2_);">--%>

    <%--                    <image style="overflow:visible;" width="500" height="500" xlink:href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEAYABgAAD/7AARRHVja3kAAQAEAAAAHgAA/+4AIUFkb2JlAGTAAAAAAQMA--%>
    <%--        EAMCAwYAAAS0AAAEwAAABOT/2wCEABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoX--%>
    <%--        Hh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQEABEQ8PERMRFRISFRQRFBEUGhQWFhQaJhoaHBoa--%>
    <%--        JjAjHh4eHiMwKy4nJycuKzU1MDA1NUBAP0BAQEBAQEBAQEBAQP/CABEIAfQB9AMBIgACEQEDEQH/--%>
    <%--        xABfAAEBAQAAAAAAAAAAAAAAAAAACAcBAQAAAAAAAAAAAAAAAAAAAAAQAQEAAAAAAAAAAAAAAAAA--%>
    <%--        AKCwEQEAAAAAAAAAAAAAAAAAAACwEgEAAAAAAAAAAAAAAAAAAACg/9oADAMBAAIRAxEAAADPwAUA--%>
    <%--        AAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAA--%>
    <%--        AAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAA--%>
    <%--        AAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAA--%>
    <%--        AAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAA--%>
    <%--        CfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAA--%>
    <%--        AAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAA--%>
    <%--        AAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAA--%>
    <%--        AAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAA--%>
    <%--        AAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAA--%>
    <%--        AAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAC--%>
    <%--        fwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAA--%>
    <%--        AAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAA--%>
    <%--        AAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAA--%>
    <%--        AAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAA--%>
    <%--        AAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAf//aAAgBAgABBQAAH//aAAgB--%>
    <%--        AwABBQAAH//aAAgBAQABBQC8D//aAAgBAgIGPwAAH//aAAgBAwIGPwAAH//aAAgBAQEGPwB4H//Z"--%>
    <%--                           transform="matrix(0.75 0 0 0.75 0 0)">--%>
    <%--                    </image>--%>
    <%--                </g>--%>
    <%--            </g>--%>
    <%--        </g>--%>
    <%--        </svg>--%>

    <%--        </div>--%>
    <%--    </a>--%>
</div>
<div class="endMessage">
    <span id="highScoreMessage"><strong>HIGH SCORE!</strong></span>
    <span><strong class="winOrLose"></strong></span>
    <br><span id="pigQuote"></span>
    <div class="boardExit gameOver"></div>
</div>
<div id="gameOver">
</div>
<div id="playArea">
</div>
<div id="playInfoControls">
    <div id="flagCounter">
        <div class="counterPigBody">
            <br>&#x00b0;(oo)&#x00b0;
            <br>_
        </div>
        <div class="counterPigEar"></div>
        <div class="counterPigSpacer"></div>
        <div class="counterPigEar"></div>
        <div id="counterNumber">100</div>
    </div>
    <div id="timeCounter">0</div>
    <a href="#" class="circleButton" id="refresh"><span>&#x21bb;</span></a>
    <a href="#" class="circleButton" id="back"><span>&#x2799;</span></a>
    <a href="#" class="circleButton gameScreen instructionsButton"><span>?</span></a>
    <%--    <a class="circleButton soundButton gameScreen" href="#">--%>
    <%--        <div class="speakerIcon"></div>--%>
    <%--    </a>--%>
    <%--    <a class="circleButton musicButton gameScreen" href="#">--%>
    <%--        <div class="musicIcon">--%>
    <%--            <svg version="1.1" id="musicSVG" class="gameScreen" xmlns="http://www.w3.org/2000/svg"--%>
    <%--                 xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"--%>
    <%--                 width="375px" height="375px" viewBox="0 0 375 375" style="enable-background:new 0 0 375 375;"--%>
    <%--                 xml:space="preserve">--%>
    <%--        <g>--%>
    <%--            <g>--%>
    <%--                <defs>--%>
    <%--                    <path id="SVGID_1_" d="M135.6,275.9c-14.4-6.9-27.4-10.3-39.1-10.3c-18.4,0-33.3,5.4-44.7,16c-11.4,10.7-17.1,23.9-17.1,39.6--%>
    <%--        				c0,14.8,4.7,26.8,14.3,36c9.5,9.2,22.4,13.8,38.7,13.8c13.8,0,26.5-3,38.2-9c11.7-6,19.9-14,24.7-24.1--%>
    <%--        				c4.8-10.1,7.2-24.2,7.2-42.3V108l133.6-41.5V229c-10.3-4.3-17.8-7-22.3-8.1c-4.6-1-9.8-1.6-15.8-1.6c-18.3,0-33.1,5.4-44.7,16.3--%>
    <%--        				c-11.5,10.9-17.3,23.8-17.3,38.7c0,14.8,4.9,26.9,14.6,36.3c9.7,9.4,22.7,14,39.1,14c14.2,0,27-3.1,38.3-9.2--%>
    <%--        				c11.3-6.1,19.3-13.9,24-23.3s7.1-23.4,7.1-42V1.4L135.6,57V275.9L135.6,275.9z"/>--%>
    <%--                </defs>--%>
    <%--                <clipPath id="SVGID_2_">--%>
    <%--                    <use xlink:href="#SVGID_1_" style="overflow:visible;"/>--%>
    <%--                </clipPath>--%>
    <%--                <g transform="matrix(1 0 0 1 0 0)" style="clip-path:url(#SVGID_2_);">--%>

    <%--                    <image style="overflow:visible;" width="500" height="500" xlink:href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEAYABgAAD/7AARRHVja3kAAQAEAAAAHgAA/+4AIUFkb2JlAGTAAAAAAQMA--%>
    <%--        EAMCAwYAAAS0AAAEwAAABOT/2wCEABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoX--%>
    <%--        Hh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQEABEQ8PERMRFRISFRQRFBEUGhQWFhQaJhoaHBoa--%>
    <%--        JjAjHh4eHiMwKy4nJycuKzU1MDA1NUBAP0BAQEBAQEBAQEBAQP/CABEIAfQB9AMBIgACEQEDEQH/--%>
    <%--        xABfAAEBAQAAAAAAAAAAAAAAAAAACAcBAQAAAAAAAAAAAAAAAAAAAAAQAQEAAAAAAAAAAAAAAAAA--%>
    <%--        AKCwEQEAAAAAAAAAAAAAAAAAAACwEgEAAAAAAAAAAAAAAAAAAACg/9oADAMBAAIRAxEAAADPwAUA--%>
    <%--        AAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAA--%>
    <%--        AAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAA--%>
    <%--        AAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAA--%>
    <%--        AAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAA--%>
    <%--        CfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAA--%>
    <%--        AAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAA--%>
    <%--        AAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAA--%>
    <%--        AAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAA--%>
    <%--        AAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAA--%>
    <%--        AAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAC--%>
    <%--        fwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAA--%>
    <%--        AAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAA--%>
    <%--        AAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAA--%>
    <%--        AAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAA--%>
    <%--        AAAAAAAAAACfwAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAACfwAAAAf//aAAgBAgABBQAAH//aAAgB--%>
    <%--        AwABBQAAH//aAAgBAQABBQC8D//aAAgBAgIGPwAAH//aAAgBAwIGPwAAH//aAAgBAQEGPwB4H//Z"--%>
    <%--                           transform="matrix(0.75 0 0 0.75 0 0)">--%>
    <%--                    </image>--%>
    <%--                </g>--%>
    <%--            </g>--%>
    <%--        </g>--%>
    <%--        </svg>--%>

    <%--        </div>--%>
    <%--    </a>--%>
</div>
</div>
<div id="highScoreContainer">
    <div class="easyContainer">
        <span class="tab"><div class="easy" id="easyTab">EASY</div></span>
        <div class="mediumDummyTab tab"></div>
        <div class="hardDummyTab tab"></div>
        <div id="easyBoard" class="easy board">
            <table>
                <tr class="place swineEasy 1">
                </tr>
                <tr class="place swineEasy 2">
                </tr>
                <tr class="place swineEasy 3">
                </tr>
                <tr class="place swineEasy 4">
                </tr>
                <tr class="place swineEasy 5">
                </tr>
                <tr class="place swineEasy 6">
                </tr>
                <tr class="place swineEasy 7">
                </tr>
                <tr class="place swineEasy 8">
                </tr>
                <tr class="place swineEasy 9">
                </tr>
                <tr class="place swineEasy 10">
                </tr>
            </table>
        </div>
    </div>
    <div class="mediumContainer">
        <span class="tab"><div class="medium" id="mediumTab">MEDIUM</div></span>
        <div class="easyDummyTab tab"></div>
        <div class="hardDummyTab tab"></div>
        <div id="mediumBoard" class="medium board">
            <table>
                <tr class="place swineMedium 1">
                </tr>
                <tr class="place swineMedium 2">
                </tr>
                <tr class="place swineMedium 3">
                </tr>
                <tr class="place swineMedium 4">
                </tr>
                <tr class="place swineMedium 5">
                </tr>
                <tr class="place swineMedium 6">
                </tr>
                <tr class="place swineMedium 7">
                </tr>
                <tr class="place swineMedium 8">
                </tr>
                <tr class="place swineMedium 9">
                </tr>
                <tr class="place swineMedium 10">
                </tr>
            </table>
        </div>
    </div>
    <div class="hardContainer">
        <span class="tab"><div class="hard" id="hardTab">HARD</div></span>
        <div class="easyDummyTab tab"></div>
        <div class="mediumDummyTab tab"></div>
        <div id="hardBoard" class="hard board">
            <table>
                <tr class="place swineHard 1">
                </tr>
                <tr class="place swineHard 2">
                </tr>
                <tr class="place swineHard 3">
                </tr>
                <tr class="place swineHard 4">
                </tr>
                <tr class="place swineHard 5">
                </tr>
                <tr class="place swineHard 6">
                </tr>
                <tr class="place swineHard 7">
                </tr>
                <tr class="place swineHard 8">
                </tr>
                <tr class="place swineHard 9">
                </tr>
                <tr class="place swineHard 10">
                </tr>
            </table>
        </div>
    </div>
    <div class='boardExit highScore'>
    </div>
</div>

<div id="questionBoardContainer">
    <div class="instructionsContainer">
        <span class="tab"><div class="instructions" id="instructionsTab">INSTRUCTIONS</div></span>
        <div class="aboutDummyTab tab"></div>
        <div id="instructionsBoard" class="instructions board">
            <h1>GOAL</h1>
            <p>
                Click on all the squares that don't contain a pig.
            </p>
            <h1>HOW TO PLAY</h1>
            <p>
                Click on a square to start. If the square contains a pig you lose. If it is adjacent to pigs a number
                will appear in the square telling you how many neighboring squares contain pigs. If it doesn't contain a
                pig and there are no nearby pigs the surrounding
                squares will be clicked.
                <br>
                <br> To mark that a square contains a pig click it and hold down for a half-second, the square will turn
                pink and the pig counter will decrease.
            </p>
        </div>
    </div>
    <div class="aboutContainer">
        <span class="tab"><div class="about" id="aboutTab">ABOUT</div></span>
        <div class="instructionsDummyTab tab"></div>
        <div id="aboutBoard" class="about board">
            <br>
            <h1>PROGRAMMING</h1>
            <p>
                Tip McMahon
            </p>
            <h1>ART & DESIGN</h1>
            <p>
                Tip McMahon
            </p>
            <h1>SOUND FX</h1>
            <p>
                Provided by Soundjay.com
            </p>
            <h1>MUSIC</h1>
            <p>
                "Panama Hat" by Jason Shaw at AudionautiX.com
            </p>
        </div>
    </div>
    <div class="boardExit questionBoard"></div>
</div>
<!-- partial -->
<script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
<script src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/jquery.mobile.custom.min.js'></script>
<script src='https://code.createjs.com/soundjs-0.6.0.min.js'></script>
<script src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/jquery.jplayer.min.js'></script>
<script src="${pageContext.request.contextPath}/resources/js/home.js"></script>
</body>
</html>
