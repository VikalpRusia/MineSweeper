var $clickBlocker = $('#clickBlocker');
var $loadingMessage = $('#loadingMessage');
var $customGameSetup = $('#customGameSetup');
var $startMenu = $('#startMenu');
var $playInfoControls = $('#playInfoControls');
var $playArea = $('#playArea');
var $highScoreBoard = $('#highScoreContainer');
var $questionBoard = $('#questionBoardContainer');
var $endMessage = $('.endMessage');
var $highScoreNameEntry = $('#highScoreName');
var $submitName = $('#submitName');
var $gameOver = $('#gameOver');
var $counterNumber = $('#counterNumber');
var $timeCounter = $('#timeCounter');
var $pigQuote = $('#pigQuote');
var $customNumPigs = $('#customNumPigs');
var $customGridSize = $('#customGridSize');
var $plusPigNum = $('.plus.pigNumber');
var $minusPigNum = $('.minus.pigNumber');
var $plusGridNum = $('.plus.gridNumber');
var $minusGridNum = $('.minus.gridNumber');
var $next = $('#next');
var $previous = $('#previous');
var $plusBox = $('.plusBox');
var $minusBox = $('.minusBox');
var $jPlayer = $('#jPlayer');
var $jPlayer2 = $('#jPlayer2');
var $highScoreMessage = $('#highScoreMessage');
var $winOrLose = $('.winOrLose');
var $mediumContainer = $('.mediumContainer');
var $hardContainer = $('.hardContainer');
var $speakerIcon = $('.speakerIcon');
var $musicIcon = $('.musicIcon');

var gameState = {
    gameGrid: [[]],
    //largest gridSize allowed in games
    maxGrid: 20,
    //default gridSize for custom games
    customGrid: 15,
    //default number of pigs for custom games
    customPigs: 40,
    musicInitialized: false,
    playSounds: true,
    playMusic: true,
    playingMusic: false,
    musicLoopOneActive: false,
    musicLoopTwoActive: false,
    //true at the beginning of every game round until the player clicks
    firstClick: true,
    playingGame: false
};
var highScoreInfo = {
    easyScores: [score("EINSWINE", 10), score("PJ&Ouml;RK", 17), score("PIGGYSUE", 32), score("BOSS HOG", 35), score("HAM SOLO", 44), score("UNCLEHAM", 45), score("HAMLET", 57), score("EINSWEIN", 82), score("BOARAT", 93), score("BRADPIGG", 145)],
    mediumScores: [score("RIHAMMA", 145), score("SIMONPIG", 157), score("PIGGYSUE", 182), score("EINSWINE", 193), score("RL SWINE", 244), score("PIGASSO", 245), score("PJ&Ouml;RK", 257), score("BOARAT", 282), score("HAMBO", 293), score("HAMBO", 345)],
    hardScores: [score("BOARAT", 285), score("RIHAMMA", 297), score("BRADPIGG", 302), score("PJ&Ouml;RK", 303), score("BOARAT", 345), score("RL SWINE", 346), score("HAM SOLO", 357), score("EINSWINE", 382), score("PIGASSO", 493), score("PIGGYSUE", 545)],
    currentCharacter: 0,
    alphaNum: " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?.,'-",
    nameArray: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};


//removes high scores from localStorage, for testing
//clearScores();
//load highScores from localStorage, failing that load defaults
loadHighScores();
//load sound files
loadSounds();
//load previous sound settings from localStorage
loadSoundSettings();
//mutes sound when game isn't visible, turns it back on once it's visible again
muteOnVisibilityChange();
//adds scores from the localStorage to the scoreboard
insertScores("swineEasy");
insertScores('swineMedium');
insertScores('swineHard');

$(window).load(function () {
    //loads name into high score name entry from localStorage if they have entered a name previously
    loadPlayerName();
    //turns on first up arrow and down arrow for high score name entry
    moveToCharacter(0);
});

///////////////PLAY AREA SETUP & LOGIC///////////////

//removes all blocks from playArea, prepares it for a new game, starts new game
function resetPlayArea() {
    $loadingMessage.show();
    $playArea.empty();
    //stops sound effects
    createjs.Sound.stop();
    gameState.time = 0;
    //set games time counter to 0
    $timeCounter.html(0);
    $endMessage.hide();
    setTimeout(initGame, 250);
}

//creates the objects that represent gameSquares
function objectGameSquare(row, column, htmlID) {
    return {
        row: row,
        column: column,
        htmlID: htmlID,
        islandNumber: []
    };
}

//creates the play area and reveals it once it's drawn
function initGame() {
    gameState.playingGame = true;
    gameState.gameGrid.length = 0;
    gameState.gameGrid = [[]];
    //sets starting time for game time counter
    gameState.time = '0';
    //clears old end game message
    $endMessage.hide();
    //makes sure the gameOver layer is hidden from previous games
    $gameOver.hide();
    //loads a quote about pigs for the lose screen
    swineQuotes();
    //generates the grid of game squares
    generateGrid();
    //sets the css code to correctly size all playArea graphics for the current gridSize
    setDynamicSizes();
    //adds the number of pigs specified by numPigs to the playArea gamesquares
    addAllPigs();
    //adds classes and contents to pig squares, number squares, and zero squares
    assignPigNumbers();
    //groups game squares into click islands that fire simultaneously when a zero square in a click island is clicked
    generateClickIslands();
    addClassesToHtml();
    //sets squaresToClick with the correct number of squares needing to be clicked to win the game
    gameState.squaresToClick = gameState.gridSize * gameState.gridSize - gameState.numPigs;
    //tells the game the firstClick has still not happened
    gameState.firstClick = true;
    //sets the flagCounter to the number of pigs hidden on the board
    $counterNumber.html(gameState.numPigs);
    $(function () {
        startMusic();
        $loadingMessage.hide();
        //starts the click actions for the playArea
        playAreaClickActions();
        //shows the counters and buttons by the playArea
        $playInfoControls.show();
        //shows the playArea
        $playArea.show();
        //hides the clickBlocker so that you can click
        $clickBlocker.hide();
        $loadingMessage.addClass("gameLoading");
    });
}

function setDifficulty(difficultyVar) {
    switch (difficultyVar) {
        case "easy":
            gameState.difficulty = "swineEasy";
            break;

        case "medium":
            gameState.difficulty = "swineMedium";
            break;

        case "hard":
            gameState.difficulty = "swineHard";
            break;

        case "custom":
            gameState.difficulty = "custom";
            break;
    }
}

//sets the gridSize, numPigs, and pig counter number depending on difficulty
function setGameParams() {
    switch (gameState.difficulty) {

        case "swineEasy":
            gameState.gridSize = 8;
            gameState.numPigs = 8;
            break;

        case "swineMedium":
            gameState.gridSize = 12;
            gameState.numPigs = 25;
            break;

        case "swineHard":
            gameState.gridSize = 16;
            gameState.numPigs = 50;
            break;
    }
}


//sorts through an array of objects and returns an array with only the objects that match the key and value supplied
function filterObjects(dataSet, key, value) {
    var arrayValues = [];

    var $filteredObjects = $.grep(dataSet, function (gameSquare) {
        var keyName;

        switch (key) {
            case "squareType":
                keyName = gameSquare.squareType;
                break;
            case "islandNumber":
                keyName = gameSquare.islandNumber;
        }

        //if value is stored in an array loop through that array and push values that match your filter to arrayValues
        if (typeof keyName === "object") {
            var i;
            var length;
            newArray = keyName;

            for (i = 0, length = newArray.length; i < length; i++) {
                if (newArray[i] === value) {
                    arrayValues.push(gameSquare);
                }
            }
        }
        return keyName === value;
    });

    //combine the two arrays of matching objects into one array and return it
    return $filteredObjects.concat(arrayValues);
}

//uses filterObjects() to sort through arrays of arrays and returns an array containing only the objects matching the key and value supplied
function filterNestedArrays(arrayName, key, value) {
    var filteredResults = [];
    var length;
    var i;

    for (i = 0, length = arrayName.length; i < length; i++) {
        var selected = filterObjects(arrayName[i], key, value);
        var numObjects;
        var j;

        for (j = 0, numObjects = selected.length; j < numObjects; j++) {
            filteredResults.push(selected[j]);
        }
    }

    return filteredResults;
}

//generates the jquery code for a specific box from row and column
function boxId(row, column) {
    return $('#row' + row + 'column' + column);
}

//repeats function at interval set in milliseconds, function can take a variable,
//speed can increase after a number of repetitions, and a limit can be set
function timedRepeat(func, ms, funcVar, repsToSpeedUp, msMinimum) {
    var reps = 0;

    myTimedRepeat = setInterval(function () {

        //if a repsToSpeedUp is provided the number of clicks is tracked with the reps var
        if (repsToSpeedUp) {
            reps++;

            //if the current speed is above the minimum or there is no minimum the msDivisor is set to 2 to halve the time between repetitions
            if ((ms > msMinimum) || !msMinimum) {
                var msDivisor = 2;
            }

            //if the current speed is equal to or below the minimum, or there is no minimum, the time between repetitions stays the same
            else {
                var msDivisor = 1;
            }

            //once the function has repeated the number of times in repsToSpeedUp a new faster timedRepeat is started
            if (reps === repsToSpeedUp) {
                clearInterval(myTimedRepeat);
                timedRepeat(func, ms / msDivisor, funcVar, repsToSpeedUp * 2, msMinimum);
            }
        }

        func(funcVar)
    }, ms);
}

//generates random whole numbers from 1 to the max number
function randomNumber(max) {
    return ((Math.floor(Math.random() * max) + 1));
}

//starts the game timer
function startTimer() {
    startTime = new Date().getTime();
    timerVar = window.setInterval(myTimer, 1000);

//subtracts the startTime from the currentTime, rounds it to the nearest second, and writes it to the game's timer display
    function myTimer() {
        currentTime = new Date().getTime();
        gameState.time = Math.round((currentTime - startTime) / 1000);
        $timeCounter.html(gameState.time);
    }
}

//stops the game timer
function clearTimer() {
    clearInterval(timerVar);
}


//when a gameSquare is clicked clickAction determines what should happen based on the box's class
function clickAction(boxId) {

    //only perform the clickAction if the box is not in an already clicked state
    if (boxId.hasClass('clicked') !== true) {
        var row = boxId.parents('div').index();
        var column = boxId.index();

        //LOSE CONDITION - clicked a pig
        if (boxId.hasClass('pig')) {
            loseBehavior(boxId);
        }

        //if the square is flagged, unflag it
        else if (boxId.hasClass('flag') === true) {
            boxId.removeClass('flag');
            updateFlaggedSquareCounter();
        }

        //if the square isn't a pig but borders pigs, click it
        else if (boxId.hasClass('zero') === false) {
            boxId.addClass('clicked');
            boxId.removeClass('unclicked');
            gameSquareNumberReveal(boxId);
        }

        //if the square has no pig or bordering pigs fill in the zero pig area
        else {
            playSound('clickIslandSound');
            zeroPigFill(row, column);
        }
    }
}

function updateFlaggedSquareCounter() {
    var previousFlagCount = gameState.flaggedSquareCounter;

    //update flaggedSquareCounter with the current number of flag squares
    gameState.flaggedSquareCounter = $('.flag').length;

    //if the number of flag squares has changed update the display
    if (previousFlagCount !== gameState.flaggedSquareCounter) {
        //flash the background of the counter display white
        counterFlash();
        //update the in game counter display to the current number of pigs left to be flagged
        $counterNumber.html(gameState.numPigs - gameState.flaggedSquareCounter);
    }
}

//checks whether a box is a zero square, numbered square, or pig square and adds appropriate information
function checkBoxes(row, column) {
    var objectBox = gameState.gameGrid[row][column];
    var boxNumber = boxId(row, column);

    if (typeof objectBox !== "undefined") {
        if (objectBox.squareType === "pig") {
            boxNumber.html('<div class=\"sleepZ\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Z<br>&nbsp;&nbsp;&nbsp;&nbsp;Z<br>Z</div><div class=\"pigContainer\"><div class = \"pigBody\"><br>&#x02d8;(oo)&#x02d8;<br>_</div><div class = \"pigEar\"></div><div class = \"pigSpacer\"></div><div class = \"pigEar\"></div><div class = \"pigFeet\"></div><div class = \"pigSpacer\"></div><div class = \"pigFeet\"></div></div>');
        } else {
            var pigCount = pigDetector(row, column);
            if (pigCount === 0) {
                objectBox.numberOfPigs = 0;
                objectBox.squareType = "zero";
                //boxNumber.html('ZERO');
            } else {
                objectBox.squareType = "number";
                boxNumber.html(pigCount);
            }
        }
    }
}

//checks all neighboring gameSquares for pigs and then returns the number found
function pigDetector(row, column) {
    var pigNumber = 0;

    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            var newRow = row + j;
            var newColumn = column + i;
            var maxNumber = gameState.gridSize - 1;

            if ((newRow > maxNumber) || (newRow < 0) || (newColumn > maxNumber) || (newRow < 0)) {
                continue;
            } else {
                var boxNumber = gameState.gameGrid[row + j][column + i];

                if (typeof boxNumber !== "undefined") {

                    if (boxNumber.squareType === "pig") {
                        pigNumber++;
                    }
                }
            }
        }
    }
    return pigNumber;
}

//generates the grid of blocks based on gameState.gameGrid's value
function generateGrid() {
    var htmlRow = "";

    for (var i = 0; i < gameState.gridSize; i++) {
        gameState.gameGrid.push([]);
        htmlRow += "<div>";

        for (var j = 0; j < gameState.gridSize; j++) {
            gameState.gameGrid[i].push(objectGameSquare(i, j, "row" + i + "column" + j));
            htmlRow += '<div id=\"row' + i + 'column' + j + '\" class=\'unclicked gameSquare\'></div>';
        }
        htmlRow += "</div>";
    }

    $('#playArea').html(htmlRow);
}

//goes through the gamegrid and assigns numbers specifying how many adjacent pigs there are
function assignPigNumbers() {
    for (var i = 0; i < gameState.gridSize; i++) {

        for (var j = 0; j < gameState.gridSize; j++) {
            checkBoxes(i, j);
        }
    }
}

//randomly changes a gameSquare's type to pig after checking to make sure it isn't already a pig
function addPig() {
    var randomRow = randomNumber(gameState.gridSize) - 1;
    var randomColumn = randomNumber(gameState.gridSize) - 1;
    var selectedObject = gameState.gameGrid[randomRow][randomColumn];
    if (typeof selectedObject !== "undefined") {
        if (selectedObject.squareType === "pig") {
            addPig();
        } else {
            selectedObject.squareType = "pig";
        }
    } else {
        addPig();
    }
}

//generates the amount of pigs specified
function addAllPigs() {
    for (var i = 0; i < gameState.numPigs; i++) {
        addPig();
    }
}

//adds needed information from objects to the HTML elements as classes
function addClassesToHtml() {
    var zeroBoxObjects = filterNestedArrays(gameState.gameGrid, "squareType", "zero");
    var numberArray = filterNestedArrays(gameState.gameGrid, "squareType", "number");
    var pigArray = filterNestedArrays(gameState.gameGrid, "squareType", "pig");
    var lastIslandNumber;

    for (var i = 0; i < zeroBoxObjects.length; i++) {
        var currentBox = zeroBoxObjects[i];
        var currentBoxHtmlID = "#" + currentBox.htmlID;
        var currentIslandNumber = currentBox.islandNumber;

        if (currentIslandNumber !== lastIslandNumber) {
            var allNumber = filterNestedArrays(gameState.gameGrid, "squareType", "number");
            var allNumberIslandNumber = filterObjects(allNumber, "islandNumber", Number(currentIslandNumber));
            var length;

            for (var j = 0, length = allNumberIslandNumber.length; j < length; j++) {
                var boxHtmlID = "#" + allNumberIslandNumber[j].htmlID;
                var $boxHtmlID = $(boxHtmlID);

                $boxHtmlID.addClass("island" + currentIslandNumber);
                if (!$boxHtmlID.hasClass("island")) {
                    $boxHtmlID.addClass("island");
                }
                if (!$boxHtmlID.hasClass("number")) {
                    $boxHtmlID.addClass("number");
                }
            }
        }

        $(currentBoxHtmlID).addClass("zero island island" + currentIslandNumber);
        lastIslandNumber = currentIslandNumber;
    }

    for (var j = 0, length = numberArray.length; j < length; j++) {
        var currentBox = "#" + numberArray[j].htmlID;
        var $currentBox = $(currentBox);

        $currentBox.addClass("number");
    }

    for (var k = 0, length = pigArray.length; k < length; k++) {
        var currentBox = "#" + pigArray[k].htmlID;
        var $currentBox = $(currentBox);

        $currentBox.addClass("pig");
    }
}

//finds all squares with zero neighboring pigs and sends each of them to clickIslands() to be analyzed
function generateClickIslands() {
    var islandNumber = 0;
    var zeroBoxObjects = filterNestedArrays(gameState.gameGrid, "squareType", "zero");
    var numberOfZeroBoxes = zeroBoxObjects.length;

    for (var i = 0; i < numberOfZeroBoxes; i++) {
        var thisZero = zeroBoxObjects[i];
        var row = thisZero.row;
        var column = thisZero.column;

        clickIslands(row, column, islandNumber);
        islandNumber++;
    }
}

//analyzes direct neighbors of specified row & column and adds key value pairs to create islands of objects with matching islandNumber
function clickIslands(row, column, islandNumber) {
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            var boxRow = (row + j);
            var boxColumn = (column + i);

            //verifies that the gameSquare is on the board before running operations on it
            if ((boxRow >= 0 && boxRow < gameState.gridSize) && (boxColumn >= 0 && boxColumn < gameState.gridSize)) {
                var boxClassName = gameState.gameGrid[boxRow][boxColumn];
                //if a zero square is already an island then all squares matching it's island number
                //will be updated with the newest island number.
                if ((boxClassName.squareType === 'zero') && (boxClassName.island === true)) {
                    var boxIslandNumber = (boxClassName.islandNumber[0]);
                    var zero = filterNestedArrays(gameState.gameGrid, "squareType", "zero");
                    var number = filterNestedArrays(gameState.gameGrid, "squareType", "number");
                    var zeroIslandNumber = filterObjects(zero, "islandNumber", boxIslandNumber);
                    var numberIslandNumber = filterObjects(number, "islandNumber", boxIslandNumber);

                    for (var k = 0; k < zeroIslandNumber.length; k++) {
                        //removes old islandNumber, zero squares should only have 1 click island number class at a time
                        zeroIslandNumber[k].islandNumber.length = 0;
                        //adds the newest islandNumber
                        zeroIslandNumber[k].islandNumber.push(islandNumber);
                    }

                    //adds the islandNumber to any number square that had the previous island number.
                    //Other classes are not removed because number squares can be part of multiple click islands.
                    for (var l = 0; l < numberIslandNumber.length; l++) {
                        var islandNumbers = numberIslandNumber[l].islandNumber;
                        var lastIslandNumber = islandNumbers[islandNumbers.length - 1];

                        if (lastIslandNumber !== islandNumber) {
                            numberIslandNumber[l].islandNumber.push(islandNumber);
                        }
                    }
                } else if (boxClassName.squareType === 'zero') {
                    boxClassName.island = true;
                    boxClassName.islandNumber.length = 0;
                    boxClassName.islandNumber.push(islandNumber);
                }
                //all other boxes get an island class and islandNumber class
                else {
                    var thisIslandNumber = boxClassName.islandNumber;
                    var lastIslandNumber = thisIslandNumber[thisIslandNumber.length - 1];

                    if (lastIslandNumber !== islandNumber) {
                        boxClassName.island = true;
                        thisIslandNumber.push(islandNumber);
                    }
                }
            }
        }
    }
}

//finds a square by row and column, finds its islandNumber, and then clicks all matching islandNumber squares
function zeroPigFill(row, column) {
    var islandNumber = gameState.gameGrid[row][column].islandNumber;
    var boxIslandNumber = (".island" + islandNumber);
    var $boxIslandNumber = $(boxIslandNumber);

    //animates away all zero squares with a matching islandNumber
    clickZeroPigAnim($(".zero" + boxIslandNumber));
    //animates all number squares with a matching islandNumber to change color and show their number
    clickZeroNumberBorderAnim($('.number' + boxIslandNumber));
    //marks all squares that were just animated as clicked
    $boxIslandNumber.addClass('clicked')
    //removes inappropriate classes
    $boxIslandNumber.removeClass('unclicked flag');
    //updates the flaggedSquareCounter variable and the in game flag counter display
    updateFlaggedSquareCounter();
}


//sets sizes for everything on the playArea relative to the current block size
function setDynamicSizes() {
    for (var m = 0; m < 3; m++) {

        //settings for the main CSS
        if (m === 0) {
            var media = '';
            var media2 = '';
            var size = 70;
            var units = 'vh';
        }

        //settings for the portrait mode CSS
        if (m === 1) {
            var media = '@media screen and (max-aspect-ratio: 35/48){ ';
            var media2 = '} ';
            var size = 96;
            var units = 'vw';
        }

        //settings for the landscape mode CSS
        if (m === 2) {
            var media = '@media screen and (min-aspect-ratio: 48/35){ ';
            var media2 = '} ';
            var size = 96;
            var units = 'vh';
        }
        var regularBlock = (size * 0.96) / gameState.gridSize;
        var clickFont = (size * (5 / 7)) / gameState.gridSize;
        var pigFont = (size * 0.25) / gameState.gridSize;

        //sets CSS pig sizes
        $('<style>')
            .text(media + '.sleepZ {font-size: ' + (regularBlock / 4) + units + '; font-size: ' + pigFont + units + ' }' + media2)
            .appendTo('head');
        $('<style>')
            .text(media + '.pigContainer {transform: scale(' + (8 / gameState.gridSize) + '); }' + media2)
            .appendTo('head');

        //sets width of the columns in CSS
        $('<style>')
            .text(media + '.row {width: ' + (size / gameState.gridSize) + units + '}' + media2)
            .appendTo('head');

        //sets size of the blocks in CSS
        $('<style>')
            .text(media + '.gameSquare { height:' + ((size / gameState.gridSize) - 0.5) + units + ';' + ' width: ' + ((size / gameState.gridSize) - 0.5) + units + ';' + ' border-radius: 1' + units + ';' + ' margin: 0.25' + units + '; font-size: ' + clickFont + units + '}' + media2)
            .appendTo('head');
    }
}

//inserts a random quote about pigs into the lose screen
function swineQuotes() {
    var quoteList = [
        ["I learned long ago, never to wrestle with a pig. You get dirty, and besides, the pig likes it.", "GEORGE BERNARD SHAW"],
        ["I want a pig. I want a pig on a leash. A baby pig on a leash.", "KE$HA"],
        ["To steal from a brother or sister is evil. To not steal from the institutions that are the pillars of the Pig Empire is equally immoral.", "ABBIE HOFFMAN"],
        ["It's no good running a pig farm badly for 30 years while saying, 'Really, I was meant to be a ballet dancer.' By then, pigs will be your style.", "QUENTIN CRISP"],
        ["I'd rather be onstage with a pig - a duet with Jennifer Lopez and me just ain't going to happen.", "MARIAH CAREY"],
        ["Anything that got to do with a pig, I ain't eatin'.", "ICE CUBE"],
        ["A pig resembles a saint in that he is more honored after death than during his lifetime.", "IRMA S. ROMBAUER"],
        ["I am not a pig farmer. The pigs had a great time, but I didn't make any money.", "WILLIE NELSON"],
        ["Much smoking kills live men and cures dead swine.", "GEORGE DENNISON PRENTICE"],
        ["I am fond of pigs. Dogs look up to us. Cats look down on us. Pigs treat us as equals.", "WINSTON CHURCHILL"],
        ["Man thrives where angels would die of ecstasy and where pigs would die of disgust.", "KENNETH REXROTH"],
        ["Pigs are smarter than dogs, and both are smarter than Congress.", "ELAYNE BOOSLER"],
        ["Pigs are not that dirty. And they're smart, strange little creatures. They just need love.", "SHELLEY DUVALL"],
        ["We celebrities are desperate pigs.", "PENN JILLETTE"],
        ["I've always loved pigs: the shape of them, the look of them, and the fact that they are so intelligent.", "MAURICE SENDAK"],
        ["There are a lot of women who live with pot-bellied pigs.", "CATHERINE ZETA-JONES"],
        ["I hate pigs. I hate goats.", "BLAKE SHELTON"],
        ["All the inane, meaningless noises people make that pass for intelligent conversation. They might as well be pigs grunting in the pen.", "NORMA FOX MAZER"],
        ["Never try to teach a pig to sing; it wastes your time and it annoys the pig.", "ROBERT HEINLEIN"],
        ["A pig used to dirt turns its nose up at rice.", "JAPANESE PROVERB"],
        ["The pig, if I am not mistaken, gives us ham and pork and bacon. Let others think his heart is big, I think it stupid of the pig.", "OGDEN NASH"],
        ["A pig bought on credit is forever grunting.", "SPANISH PROVERB"],
        ["In a generation of swine, the one-eyed pig is king.", "HUNTER S. THOMPSON"],
        ["He that makes himself dirt is trod on by the swine.", "ITALIAN PROVERB"],
        ["People lucky enough to live in the vicinity of an industrial hog farm are, with each breath, made keenly aware of the cause of their declining property values.", "AL FRANKEN"],
        ["Watch out when you're getting all you want. Fattening hogs ain't in luck.", "JOEL CHANDLER HARRIS"],
        ["The creatures outside looked from pig to man, and from man to pig, and from pig to man again; but already it was impossible to say which was which.", "GEORGE ORWELL"]
    ];
    var quoteLength = quoteList.length;
    var quotePick = Math.floor(Math.random() * quoteLength);
    var quote = quoteList[quotePick][0];
    var quotePerson = quoteList[quotePick][1];
    var quoteHTML = (quote) + "<br> <strong>-" + (quotePerson) + "</strong>";

    //insert quote and associated html into pigQuote section of the lose screen
    $pigQuote.html(quoteHTML);
}


///////////////END GAME FUNCTIONS///////////////

//initiates the correct end game behavior for losing game
function loseBehavior(boxId) {
    //selects the pig in the supplied boxId
    var pig = boxId.find('.pigContainer');

    playSound('pokePigSound');
    //stops the game timer
    clearInterval(timerVar);
    //hides high score message
    $highScoreMessage.hide();
    //sets the losing text for the end screen
    $winOrLose.html("YOU<br>LOSE!");
    //prevents clicking on the gamesquares after the game is over
    $gameOver.show();
    //prevents clicking on any of the game controls until the lose screen has been closed
    $gameOver.addClass('noClick');
    //animates the pig you clicked appearing and looking up at you
    pigLookUp(pig);
    //reveals the rest of the pigs after a 1 second delay
    showPigs(1);
    //reveals the losing message after 1.75 second delay
    endMessageReveal(1.75);
}

//initiates the correct end game behavior depending on whether the win was a high score or not
function winBehavior() {

    playSound('sleepingPigSound');
    //stops the game timer
    clearInterval(timerVar);
    //clear out the pigQuote as those are only for losers
    $pigQuote.empty();

    //if the game is not custom difficulty find the worst high score for the current difficulty
    if (gameState.difficulty != "custom") {
        var worstHighScore = JSON.parse(localStorage.getItem(gameState.difficulty))[9].score;

        //if the player beats the worst high score they get the high score ending
        if (worstHighScore >= gameState.time) {
            highScore();
        }

        //otherwise they get non high score
        else {
            nonHighScore();
        }
    }

    //custom games are always non high scoring
    else {
        nonHighScore();
    }
}

//end game actions for a high scoring game
function highScore() {
    submitNameClickAction();
    $highScoreMessage.show();
    //clear losing message
    $winOrLose.empty();
    //prevents clicking on the gamesquares after the game is over
    $gameOver.show();
    //prevents clicking on any of the game controls until the lose screen has been closed
    $gameOver.addClass('noClick');
    //reveals the pigs in the game squares
    showSleepingPigs();
    //animates the sleep Zs after a 0.5 second delay
    zAnim(0.5);
    //reveals the winning message after 1 second delay
    endMessageReveal(1);
    //reveals the high score name entry screen after 2 second delay
    showHighScoreName(2);
    //brings the current difficulty high score board to the top of of the high score board
    highScoreBoardTop(gameState.difficulty);
}

//end game actions for a non high scoring game
function nonHighScore() {
    $highScoreMessage.hide();
    //sets winning text for end game
    $winOrLose.html("<br>YOU<br>WIN!");
    //prevents clicking on the gamesquares after the game is over
    $gameOver.show();
    //prevents clicking on any of the game controls until the lose screen has been closed
    $gameOver.addClass('noClick');
    //reveals the pigs in the game squares
    showSleepingPigs();
    //animates the sleep Zs after a 0.5 second delay
    zAnim(.5);
    //reveals the winning message after 1 second delay
    endMessageReveal(1);
}

//changes which tab is on top on the high score board
function highScoreBoardTop(swineDifficulty) {
    switch (swineDifficulty) {

        //returns the board to the default state where no tab has the foreground id
        case "swineEasy":
            $mediumContainer.attr('id', '');
            $hardContainer.attr('id', '');
            break;

        //adds highScoreForeground id to the medium tab, placing it on top of the other tabs
        case "swineMedium":
            $hardContainer.attr('id', '');
            $mediumContainer.attr('id', 'highScoreForeground');
            break;

        //adds highScoreForeground id to the hard tab, placing it on top of the other tabs
        case "swineHard":
            $mediumContainer.attr('id', '');
            $hardContainer.attr('id', 'highScoreForeground');
            break;
    }
}


///////////////CUSTOM GAME SETUP///////////////

//increases the number of pigs for a custom game and updates the custom setup screen
function plusPigNumber() {
    //the maximum number of pigs that can fit on the board while still having 1 empty gamesquare
    var maxPigs = Math.pow(gameState.customGrid, 2) - 1;


    //increase the number of pigs as long as it doesn't exceed the maximum
    if (gameState.customPigs < maxPigs) {
        playSound('lightClickSound');
        gameState.customPigs++;
        $customNumPigs.html(gameState.customPigs);
    }

    //if pigs reach the maximum but the gridSize is below its maximum increase the gridSize and pigs
    else if ((gameState.customPigs === maxPigs) && (gameState.customGrid < gameState.maxGrid)) {
        gameState.customPigs++;
        gameState.customGrid++;
        $customNumPigs.html(gameState.customPigs);
        $customGridSize.html(gameState.customGrid + "x" + gameState.customGrid);
    }
}

//decreases the number of pigs for a custom game and updates the custom setup screen
function minusPigNumber() {

    //only decrease the pigNumber if there is more than 1 pig
    if (gameState.customPigs > 1) {
        playSound('lightClickSound');
        gameState.customPigs--;
        $customNumPigs.html(gameState.customPigs);
    }
}

//increases the gridSize for a custom game and updates the custom setup screen
function plusGridNumber() {

    //only increase the customGrid if it's below the maximum
    if (gameState.customGrid < gameState.maxGrid) {
        playSound('lightClickSound');
        gameState.customGrid++;
        $customGridSize.html(gameState.customGrid + "x" + gameState.customGrid);
    }
}

//decreases the gridSize for a custom game and updates the custom setup screen
function minusGridNumber() {

    //only decrease the gridNumber if it's greater than 2
    if (gameState.customGrid > 2) {
        playSound('lightClickSound');
        gameState.customGrid--;
        $customGridSize.html(gameState.customGrid + "x" + gameState.customGrid);

        //maxPigs need to be set after customGrid has updated
        var maxPigs = Math.pow(gameState.customGrid, 2) - 1;
        //if the number of pigs is now above the maximum set it to the maximum
        if (gameState.customPigs > maxPigs) {
            gameState.customPigs = maxPigs;
            $customNumPigs.html(gameState.customPigs);
        }
    }
}


///////////////HIGH SCORE LOGIC///////////////

//creates score object
function score(name, numberOfSeconds) {
    return {
        name: name,
        score: numberOfSeconds
    };
}

//checks to see if there are scores in localstorage and if not it loads the defaults
function loadHighScores() {

    if ((localStorage.getItem("swineEasy") === null) || (localStorage.getItem("swineMedium") === null) || (localStorage.getItem("swineHard") === null)) {
        localStorage.setItem("swineEasy", JSON.stringify(highScoreInfo.easyScores));
        localStorage.setItem("swineMedium", JSON.stringify(highScoreInfo.mediumScores));
        localStorage.setItem("swineHard", JSON.stringify(highScoreInfo.hardScores));
    }
}

//clears the high score board and allows the game to restore default high scores
function clearScores() {
    localStorage.removeItem("swineEasy");
    localStorage.removeItem("swineMedium");
    localStorage.removeItem("swineHard");
}

//places high score in correct position in localStorage of high scores
function highScoreSort(name) {
    var scores = JSON.parse(localStorage.getItem(gameState.difficulty));

    for (var i = 0; i < 10; i++) {
        var oldScore = JSON.parse(localStorage.getItem(gameState.difficulty))[i].score;

        if (gameState.time <= oldScore) {
            scores.splice(i, 0, score(name, gameState.time));
            scores.splice(10, 1);
            localStorage.setItem(gameState.difficulty, JSON.stringify(scores));
            break;
        }
    }
}

//adds scores from the localStorage to the scoreboard
function insertScores(rank) {
    for (var i = 0; i < highScoreInfo.easyScores.length; i++) {
        var firstPlace = '';
        if (i === 0) {
            firstPlace = '&#x265a;'
        }
        var className = '.place.' + rank + '.' + (i + 1);
        $(className)
            .html('<td>&nbsp;' + firstPlace + JSON.parse(localStorage.getItem(rank))[i].name + firstPlace + '</td>' + '<td>' + JSON.parse(localStorage.getItem(rank))[i].score + ' seconds&nbsp;</td>');
    }
}


///////////////HIGH SCORE NAME ENTRY///////////////


//loads player name into high score entry from localStorage if they have entered a name previously
function loadPlayerName() {
    //if lastHighScoreName exists in localStorage retrieve it
    if (localStorage.getItem('lastHighScoreName')) {
        highScoreInfo.nameArray = JSON.parse(localStorage.getItem('lastHighScoreName'));

        //decodes and writes the letters out to the high score name entry screen
        for (var a = 0; a < 8; a++) {
            var charBox = ".character" + a;
            var currentChar = highScoreInfo.nameArray[a];
            var charAlphaNum = highScoreInfo.alphaNum[currentChar];

            $(charBox).html(charAlphaNum);
        }
    }
}

//assembles the player's name from values stored in nameArray and alphaNum and returns it
function assembleName() {
    var highScoreName = '';

    for (var a = 0; a < 8; a++) {
        var currentChar = highScoreInfo.nameArray[a];

        highScoreName += highScoreInfo.alphaNum.charAt(currentChar);
    }
    return highScoreName;
}

function clearName() {
    for (var a = 0; a < 8; a++) {
        var currentChar = highScoreInfo.nameArray[a];

        //subtracts the currentChar's value from itself to reset it to 0 value (a space)
        changeCharacter(a, -(currentChar));
    }
}

//generates a click action that can only be clicked once, prevents double high score submissions
function submitNameClickAction() {
    $submitName
        .one('vclick', function () {
            localStorage.setItem('lastHighScoreName', (JSON.stringify(highScoreInfo.nameArray)));
            highScoreSort(assembleName());
            insertScores(gameState.difficulty);
            hideHighScoreName(0.5);
            setTimeout(function () {
                $highScoreMessage.hide();
            }, 500);
            $(".boardExit.highScore").hide();
            $gameOver
                .removeClass('noClick');
            highScoreBoardOn();
        });
}

//changes the character at charPosition by the value in changeValue
function changeCharacter(charPosition, changeValue) {
    var currentBox = ".character" + charPosition;

    //update the value in the nameArray
    highScoreInfo.nameArray[charPosition] += changeValue;
    //change the displayed character on the name entry screen to the new value
    $(currentBox).html(highScoreInfo.alphaNum.charAt(highScoreInfo.nameArray[charPosition]));
}

//moves the player's current character position selection
function moveToCharacter(charPosition) {
    var previousMinus = ".minus" + highScoreInfo.currentCharacter;
    var previousPlus = ".plus" + highScoreInfo.currentCharacter;
    var currentMinus = ".minus" + charPosition;
    var currentPlus = ".plus" + charPosition;

    //clears the myTimedRepeat to prevent endless looping on one character
    //clearInterval(myTimedRepeat);
    //hides the buttons that were showing
    $(previousMinus).css("visibility", "hidden");
    $(previousPlus).css("visibility", "hidden");
    //makes new buttons visible in the new position
    $(currentMinus).css("visibility", "visible");
    $(currentPlus).css("visibility", "visible");
    //sets the currentCharacter to the new current character position
    highScoreInfo.currentCharacter = charPosition;
}

//changes character to the next value in alphaNum
function plusCharBox(boxName) {
    var charPosition = Number(boxName.charAt(boxName.length - 1));
    var changeValue = 1;

    //if the value in nameArray goes past the end of alphaNum have it start over at the beginning
    if (highScoreInfo.nameArray[charPosition] > highScoreInfo.alphaNum.length - 1) {
        changeValue = -(highScoreInfo.alphaNum.length - 1);
    }

    changeCharacter(charPosition, changeValue);
}

//changes character to the previous value in alphaNum
function minusCharBox(boxName) {
    var charPosition = Number(boxName.charAt(boxName.length - 1));
    var changeValue = -1;

    //if the charPosition is 0 start over at the end of alphaNum
    if (highScoreInfo.nameArray[charPosition] < 1) {
        changeValue = highScoreInfo.alphaNum.length - 1;
    }

    changeCharacter(charPosition, changeValue);
}

//selects the next character position on the name entry screen
function nextChar() {
    if (highScoreInfo.currentCharacter < 7) {
        moveToCharacter(highScoreInfo.currentCharacter + 1);
    }

    //if the character is at the last position go back to the first
    else {
        moveToCharacter(0);
    }
}

//selects the previous character position on the name entry screen
function previousChar() {
    if (highScoreInfo.currentCharacter > 0) {
        moveToCharacter(highScoreInfo.currentCharacter - 1);
    }

    //if the character is at the first position go to the last
    else {
        moveToCharacter(7);
    }
}


///////////////START MENU CLICK ACTIONS///////////////

//click actions for the easy, medium, hard, and custom buttons
$('.startButton')
    .on('vclick', function () {
        var $this = $(this);
        var $newDifficulty = $this.attr('id');

        playSound('clickSound');
        //prevents clicking during transition
        $clickBlocker.show();
        //sets the difficulty based on which button was pressed
        setDifficulty($newDifficulty);
        //animate the clicked button
        buttonClick($this);

        setTimeout(function () {
            if (gameState.difficulty === "custom") {
                startMenuOff(customGameOn);
                //set gridSize to the default custom value or the last custom value entered
                gameState.gridSize = gameState.customGrid;
                //set numPigs to the default custom value or the last custom value entered
                gameState.numPigs = gameState.customPigs;
                //set the custom board settings display to show the customPigs value
                $customNumPigs.html(gameState.customPigs);
                //set the custom board settings display to show the customGrid value
                $customGridSize.html(gameState.customGrid + "x" + gameState.customGrid);
                //show the custom game settings screen
                //customGameOn();
            } else {
                setGameParams();
                startMenuOff(loadingMessageOn);
            }
        }, 500);
    });

//plays generic animation & sound for all circular button presses
$('.circleButton')
    .on('vclick', function () {
        playSound('clickSound');
        buttonClick($(this));
    });

//shows the instructions and about screen and blocks clicks during the button press
$('.instructionsButton')
    .on('vclick', function () {
        $clickBlocker.show();
        questionBoardOn();
    });

//gets rid of the end message when it is clicked and allows buttons to be pressed again
$endMessage
    .on('vclick', function () {
        $highScoreBoard.hide();
        $(".boardExit.highScore").show();
        playSound('lightClickSound');
        $gameOver.removeClass('noClick');
        setTimeout(resetPlayArea, 500);
    });

//shows the high scores screen and blocks clicks during the button press
$('#highScores')
    .on('vclick', function () {
        $clickBlocker.show();
        highScoreBoardOn();
    });

//turns sound effects on and off, updates localStorage sound settings
$('.soundButton')
    .on('vclick', function () {
        //if sound effects are enabled disable them and stop currently playing sounds, update localStorage sound settings
        if (gameState.playSounds) {
            //puts a slash through the speakerIcon in the soundButton
            $speakerIcon.addClass('mute');
            //sets game to not play sound effects
            gameState.playSounds = false;
            //stop any currently playing sound effect
            createjs.Sound.stop();
            //save sound settings to localStorage so they can persist between play sessions
            localStorage.setItem('swinePeeperSound', (JSON.stringify([gameState.playSounds, gameState.playMusic])));
        }

        //if sounds effects are currently turned off then turn sound effects back on, update localStorage sound settings
        else if (!gameState.playSounds) {
            //gets rid of slash over the icon in the soundButton
            $speakerIcon.removeClass('mute');
            //sets game to play sound effects
            gameState.playSounds = true;
            //save sound settings to localStorage so they can persist between play sessions
            localStorage.setItem('swinePeeperSound', (JSON.stringify([gameState.playSounds, gameState.playMusic])));
        }
    });
//turns sound effects on and off, updates localStorage sound settings
$('.musicButton')
    .on('vclick', function () {
        //if music is enabled disable it and stop currently playing music, update localStorage sound settings
        if (gameState.playMusic) {
            //puts a slash through the music in the soundButton
            $musicIcon.addClass('mute');
            //sets game to not play sound effects
            gameState.playMusic = false;
            //stop currently playing Music
            stopMusic();
            //save sound settings to localStorage so they can persist between play sessions
            localStorage.setItem('swinePeeperSound', (JSON.stringify([gameState.playSounds, gameState.playMusic])));
        }

        //if music is currently turned off then turn music back on, update localStorage sound settings
        else if (!gameState.playMusic) {
            //gets rid of slash over the icon in the musicButton
            $musicIcon.removeClass('mute');
            //sets game to play sound effects
            gameState.playMusic = true;
            //save sound settings to localStorage so they can persist between play sessions
            localStorage.setItem('swinePeeperSound', (JSON.stringify([gameState.playSounds, gameState.playMusic])));
        }
        //if a game is going start the music playing
        if (gameState.playingGame) {
            startMusic();
        }
    });

///////////////HIGH SCORE BOARD/ABOUT BOARD CLICK ACTIONS///////////////

//when switching between tabs on about/instructions/high score screen play sound effect
$('.tab')
    .on('vclick', function () {
        playSound('pageFlipSound');
    });

//return about tab to background on tabbed question board
$(".instructionsDummyTab")
    .on('vclick', function () {
        $('.aboutContainer').attr('id', '');
    });

//bring about tab to foreground on tabbed question board
$(".aboutDummyTab")
    .on('vclick', function () {
        $('.aboutContainer').attr('id', 'questionBoardForeground');
    });

//hide the instructions/about screen when clicking the darkened background
$('.boardExit.questionBoard')
    .on('vclick', function () {
        playSound('lightClickSound');
        $($questionBoard).hide();
    });

//bring easy high scores tab to foreground of high scores window
$(".easyDummyTab")
    .on('vclick', function () {
        highScoreBoardTop('swineEasy');
    });

//bring medium high scores tab to foreground of high scores window
$(".mediumDummyTab")
    .on('vclick', function () {
        highScoreBoardTop('swineMedium');
    });

//bring hard high scores tab to foreground of high scores window
$(".hardDummyTab")
    .on('vclick', function () {
        highScoreBoardTop('swineHard');
    });

//hide the high score screen when clicking the darkened background
$('.boardExit.highScore')
    .on('vclick', function () {
        playSound('lightClickSound');
        $highScoreBoard.hide();
    });


///////////////CUSTOM GAME SETUP CLICK ACTIONS///////////////

//while holding down the pig up arrow on the custom game setup run plusPigNumber() every 175 milliseconds,
//with a null variable, after 10 repetitions double speed, never go faster than once every 50 milliseconds
$plusPigNum
    .on('vmousedown', function () {
        plusPigNumber();
        timedRepeat(plusPigNumber, 175, null, 10, 50);
    });

//if you stop pressing the button stop the repeating function
$plusPigNum
    .on('vmouseup vmouseleave mouseleave', function () {
        clearInterval(myTimedRepeat);
    });

//while holding down the pig down arrow on the custom game setup run minusPigNumber() every 175 milliseconds,
//with a null variable, after 10 repetitions double speed, never go faster than once every 50 milliseconds
$minusPigNum
    .on('vmousedown', function () {
        minusPigNumber();
        timedRepeat(minusPigNumber, 175, null, 10, 50);
    });

//if you stop pressing the button stop the repeating function
$minusPigNum
    .on('vmouseup vmouseleave mouseleave', function () {
        clearInterval(myTimedRepeat);
    });

//while holding down the grid up arrow on the custom game setup run plusGridNumber() every 175 milliseconds,
//with a null variable, after 5 repetitions double speed
$plusGridNum
    .on('vmousedown', function () {
        plusGridNumber();
        timedRepeat(plusGridNumber, 175, null, 5);
    });

//if you stop pressing the button stop the repeating function
$plusGridNum
    .on('vmouseup vmouseleave mouseleave', function () {
        clearInterval(myTimedRepeat);
    });

//while holding down the grid down arrow on the custom game setup run minusGridNumber() every 175 milliseconds,
//with a null variable, after 5 repetitions double speed
$minusGridNum
    .on('vmousedown', function () {
        minusGridNumber();
        timedRepeat(minusGridNumber, 175, null, 5);
    });

//if you stop pressing the button stop the repeating function
$minusGridNum
    .on('vmouseup vmouseleave mouseleave', function () {
        clearInterval(myTimedRepeat);
    });

//start the game with the currently displayed number of pigs and gridSize
$('.check')
    .on('vclick', function () {
        //prevent clicks during transition
        $clickBlocker.show();
        //sets numPigs to custom selection
        gameState.numPigs = gameState.customPigs;
        //sets gridSize to custom selection
        gameState.gridSize = gameState.customGrid;
        //hides custom game settings and then starts the game
        customGameOff();
        setTimeout(function () {
            $loadingMessage.show();
        }, 550);
        setTimeout(initGame, 750);
    });

//hides custom game settings and goes back to start menu
$('.x')
    .on('vclick', function () {
        //prevent clicks during transition
        $clickBlocker.show();
        //hides custom game settings
        customGameOff();
        //turns on start menu after 0.75 second delay
        startMenuOn(0.75);
    });


///////////////HIGH SCORE NAME ENTRY CLICK ACTIONS///////////////

$next
    .on('vmousedown', function () {
        nextChar();
        timedRepeat(nextChar, 150);
    });

$next
    .on('vmouseup vmouseleave mouseleave', function () {
        clearInterval(myTimedRepeat);
    });

$previous
    .on('vmousedown', function () {
        previousChar();
        timedRepeat(previousChar, 150);
    });

$previous
    .on('vmouseup vmouseleave mouseleave', function () {
        clearInterval(myTimedRepeat);
    });

$('.nameBox')
    .on('vclick', function () {
        var boxName = this.className;
        moveToCharacter(Number(boxName.charAt((boxName.length - 1))));
    });

$plusBox
    .on('vmousedown', function () {
        var boxName = this.className;
        plusCharBox(boxName);
        timedRepeat(plusCharBox, 150, boxName, 5, 50);
    });

$plusBox
    .on('vmouseup vmouseleave mouseleave', function () {
        clearInterval(myTimedRepeat);
    });

$minusBox
    .on('vmousedown', function () {
        var boxName = this.className;
        minusCharBox(boxName);
        timedRepeat(minusCharBox, 150, boxName, 5, 50);
    });

$minusBox
    .on('vmouseup vmouseleave mouseleave', function () {
        clearInterval(myTimedRepeat);
    });

$('#clearName')
    .on('vclick', function () {
        clearName();
    });

///////////////PLAY AREA INFO CONTROLS CLICK ACTIONS///////////////

$('#back')
    .on('vclick', function () {
        $loadingMessage.removeClass("gameLoading");
        //stops music
        stopMusic();
        $clickBlocker.show();
        startMenuOn(0.75);
        playInfoControlsOff(0.5);
        playAreaOff(0.5, clearTimer);
    });

$('#refresh')
    .on('vclick', function () {
        if (!gameState.firstClick) {
            $clickBlocker.show();
            clearTimer();
            setTimeout(resetPlayArea, 500);
            setTimeout(initGame, 850);
        }
    });

$('.counterPigBody')
    .on('vclick', function () {
        playSound('pokePigSound');
    });

///////////////PLAYAREA CLICK ACTIONS///////////////

//playArea click actions have to be started after the playArea is drawn or they won't work
function playAreaClickActions() {
    //number of ms to hold down to flag a gamesquare as having a pig
    var longPress = 200;

    //when a gamesquare is held down it starts a timer to flag the square and a timer for cheat mode
    $(".gameSquare")
        .on('vmousedown', function () {
            //number of ms to hold down a gamesquare to reveal pigs, cheat mode
            var cheatPress = 5000;
            var $boxId = $(this);
            start = new Date().getTime();

            //if this is the first click start the game timer and set firstClick to false
            if (gameState.firstClick) {
                startTimer();
                gameState.firstClick = false;
            }
            //if the gameSquare is held down longer than longPress flag the square
            flagTimer = setTimeout(function () {
                if ($boxId.hasClass('unclicked')) {
                    playSound('flagBlockSound');
                    //mark square as a flag
                    $boxId.toggleClass('flag');
                    //show new flag counter total
                    updateFlaggedSquareCounter();
                }
            }, longPress);

            //if click held longer than cheatPress activate cheat mode (see all pigs)
            cheatTimer = setTimeout(function () {
                //reveal pigs after 0.5 second delay
                showPigs(0.5);
                //cheatMode changes the difficulty to custom so you cannot get a high score
                gameState.difficulty = "custom";
            }, cheatPress);
        });

    //if the player moves off the gameSquare cancel flagTimer and cheatTimer
    $(".gameSquare")
        .on('vmouseleave', function () {
            clearTimeout(flagTimer);
            clearTimeOut(cheatTimer);
        });

    //on release of the gameSquare cancel the timers. If the press was shorter than a longpress treat it
    //as a normal click and remove a flag if it's present, send the action to clickAction otherwise
    $(".gameSquare")
        .on('vmouseup', function () {
            var $boxId = $(this);
            var newTime = new Date().getTime();

            //stop the flagTimer
            clearTimeout(flagTimer);
            //stop the cheatTimer
            clearTimeout(cheatTimer);

            //if the click was held for shorter than longpress it's just a click
            if (newTime - start < longPress) {

                //if the square is flagged remove the flag
                if ($boxId.hasClass('flag')) {
                    playSound('flagBlockSound');
                    $boxId.removeClass('flag');
                    updateFlaggedSquareCounter();
                }

                //otherwise send it to clickAction
                else {
                    playSound('clickBlockSound');
                    clickAction($boxId);
                }

                //WIN CONDITION - if you've clicked every non pig square you win, run winBehavior
                if ($('.clicked').length === gameState.squaresToClick) {
                    winBehavior();
                }
            }
        });
}


///////////////ANIMATIONS///////////////

//animates away all zero gamesquares with an island number matching the input's
function clickZeroPigAnim(zeroIsland) {
    TweenLite.to($(zeroIsland), 0.5, {
        scale: 0,
        ease: Power1.easeInOut
    });
}

//changes color and reveals number on number squares with island number matching the input's
function clickZeroNumberBorderAnim(borderNumbers) {
    TweenMax.to($(borderNumbers), 0.5, {
        color: '#000000',
        backgroundColor: "#369381",
        ease: Power1.easeInOut
    });
}

//changes color and reveals number on number square specified by boxNumber
function gameSquareNumberReveal(boxNumber) {
    TweenLite.to(boxNumber, 0.5, {
        color: '#000000',
        backgroundColor: "#369381",
        ease: Power1.easeInOut,
    });
}

//reveals the high score name entry screen after a delay specified by the var
function showHighScoreName(delay) {
    TweenMax.to($highScoreNameEntry, 0, {
        display: 'inline',
        opacity: 1,
        delay: delay
    });
}

//reveals all pigs after a delay specified by the var
function showPigs(delay) {
    TweenMax.to($('.pigContainer'), 0, {
        delay: delay,
        display: 'inline',
        opacity: 1
    });
}

//reveals all pigs after a delay specified by the var and then animates their sleepZs
function showSleepingPigs(delay) {
    TweenMax.to($('.pigContainer'), 0, {
        delay: delay,
        display: 'inline',
        opacity: 1,
        onComplete: function () {
            $('.sleepZ')
                .show();
        }
    });
}

//reveals the specified pig and animates it looking up
function pigLookUp(pig) {
    TweenLite.to(pig, 0.5, {
        display: 'inline',
        opacity: 1,
        ease: Power1.easeInOut,
        onComplete: function () {
            var $pigBody = $('.pigBody');

            //animates the pig looking up
            $pigBody.addClass('pigLookUp');
            //opens the pig's eyes
            $pigBody.html('<br>&#x00b0;(oo)&#x00b0;</br>~')
        }
    });
}

//hides high score name entry screen after delay specified in the var
function hideHighScoreName(delay) {
    TweenMax.to($highScoreNameEntry, 0, {
        display: 'none',
        opacity: 0,
        delay: delay
    });
}

//animates the pigs' sleepZs after a delay set in the var
function zAnim(delay) {
    TweenMax.to($('.sleepZ'), 3, {
        delay: delay,
        opacity: 0,
        top: "-10vh",
        right: "-1vh",
        ease: Power2.easeOut,
        repeat: -1,
        yoyo: false
    });
}

//shows end game message after a delay set in the var
function endMessageReveal(delay) {
    TweenMax.to($endMessage, 0, {
        display: 'block',
        opacity: 1,
        delay: delay
    });
}

//hides end game message after a delay set in the var
function endMessageHide(delay) {
    TweenMax.to($endMessage, 0, {
        display: 'none',
        opacity: 0,
        delay: delay
    });
}

function loadingMessageOn() {
    TweenMax.to($loadingMessage, 0, {
        display: 'inline',
        opacity: 1,
        onComplete: function () {
            setTimeout(initGame, 250);
        }
    });
}

//reveals start menu after a delay set in the var, then removes the clickBlock to allow clicking
function startMenuOn(delay) {
    TweenMax.to($startMenu, 0, {
        delay: delay,
        display: 'inline',
        opacity: 1,
        onComplete: function () {
            $clickBlocker.hide();
        }
    });
}

//turns off start menu after 0.5 second delay, then runs callback function if specified
function startMenuOff(callback, callbackVar) {
    TweenMax.to($startMenu, 0, {
        delay: 0.5,
        display: 'none',
        opacity: 0,
        onComplete: callback,
        onCompleteParams: callbackVar
    });
}

//makes background of the flag counter in game flash white for visual feedback
function counterFlash() {
    TweenMax.to($('#flagCounter'), 0.2, {
        backgroundColor: "#FDE4EC",
        yoyo: true,
        repeat: 1
    });
}

//hides the buttons and info by the playArea after a delay set in the var
function playInfoControlsOff(delay) {
    TweenMax.to($playInfoControls, 0, {
        delay: delay,
        display: 'none'
    });
}

//hides playArea after delay specified, then stops music/soundFX, sets time to null,
//sets timeCounter to 0, and runs callback function
function playAreaOff(delay, callback) {
    TweenMax.to($playArea, 0, {
        delay: delay,
        display: 'none',
        onComplete: function () {
            //stops sound effects
            createjs.Sound.stop();
            //time should be null when not in a game
            gameState.playingGame = false;
            //set games time counter to 0
            $timeCounter.html(0);
            callback();
        }
    });
}

//animates clicked button then runs a callback function with optional variable
function buttonClick(button, callback) {
    TweenMax.to(button, 0.25, {
        force3D: true,
        backgroundColor: "white",
        ease: Power1.easeInOut,
        yoyo: true,
        repeat: 1,
        onComplete: function () {
            //restores element's original background-color if fast clicking turns it permanently white
            button.css("background-color", "");
            callback();
        }
    });
}

//shows custom game settings screen and removes the clickBlocker, allowing clicks
function customGameOn() {
    TweenMax.to($customGameSetup, 0, {
        delay: 0.5,
        opacity: 1,
        display: 'inline',
        onComplete: function () {
            $clickBlocker.hide();
        }
    });
}

//hides custom game settings screen then runs a callback function
function customGameOff(callback) {
    TweenMax.to($customGameSetup, 0, {
        delay: 0.5,
        opacity: 0,
        display: "none",
        onComplete: callback
    });
}

//shows the high score board and then removes clickBlocker, allowing clicks
function highScoreBoardOn() {
    TweenMax.to($highScoreBoard, 0, {
        delay: 0.5,
        opacity: 1,
        display: 'inline',
        onComplete: function () {
            $clickBlocker.hide();
        }
    });
}

//shows the instructions/about board and then removes clickBlocker, allowing clicks
function questionBoardOn() {
    TweenMax.to($questionBoard, 0, {
        delay: 0.5,
        opacity: 1,
        display: 'inline',
        onComplete: function () {
            $clickBlocker.hide();
        }
    });
}


///////////////SOUND///////////////

//if there are saved sound settings in local storage it applies them to the game
function loadSoundSettings() {
    //first verify there are saved sound settings
    if (localStorage.getItem('swinePeeperSound')) {
        var soundSettings = JSON.parse(localStorage.getItem('swinePeeperSound'));
        gameState.playSounds = soundSettings[0];
        gameState.playMusic = soundSettings[1];

        //if sound effects are muted add the class mute to put a slash over the speakerIcon
        if (!gameState.playSounds) {
            $speakerIcon.addClass('mute');
        }

        //if music is muted add the class mute to put a slash over the musicIcon
        if (!gameState.playMusic) {
            $musicIcon.addClass('mute');
        }
    }
}

//load the game's sound effects
function loadSounds() {
    createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/buttonclick.mp3", 'clickSound', 10);
    createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/clickisland.mp3", 'clickIslandSound', 10);
    createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/lightclick.mp3", 'lightClickSound', 10);
    createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/pokepig.mp3", 'pokePigSound', 10);
    createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/clickblock.mp3", 'clickBlockSound', 10);
    createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/flagblock.mp3", 'flagBlockSound', 10);
    createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/pageflip.mp3", 'pageFlipSound', 10);
    createjs.Sound.registerSound("https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/sleepingpigs.mp3", 'sleepingPigSound', 1);
}

//play a loaded sound if sound effects aren't muted
function playSound(soundID) {
    if (gameState.playSounds) {
        createjs.Sound.play(soundID);
    }
}

//play music if it isn't muted, if it needs to be initialized then start the jPlayer system
function startMusic() {

    //if music has been started previously, isn't muted, and isn't already playing, start playing the music
    if (gameState.musicInitialized && gameState.playMusic && gameState.playingMusic !== true) {
        $jPlayer.jPlayer('play');
        gameState.playingMusic = true;
    }

    //if music isn't muted but hasn't been played yet load the sound file
    else if (gameState.playMusic && gameState.playingMusic !== true) {
        gameState.musicInitialized = true;

        //load song and start playing it
        $jPlayer.jPlayer({
            ready: function (event) {
                $(this).jPlayer("setMedia", {
                    mp3: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/PanamaHatNV_LOOP_CUT3.mp3",
                }).jPlayer('play');
            },

            //if the music ends start it over with the second jPlayer instance
            playing: function () {
                musicLoopOne = setTimeout(function () {
                    if (gameState.playingGame) {
                        stopMusic();
                        $jPlayer2.jPlayer("play");
                        gameState.musicLoopOneActive = false;
                    }
                }, 102850);
                gameState.musicLoopOneActive = true;
                gameState.playingMusic = true;
            },
            supplied: "mp3",
            wmode: "window",
        });

        //load song in second instance and pause it so it can start instantly after the first player ends for (mostly) seamless looping
        $jPlayer2.jPlayer({
            ready: function (event) {
                $(this).jPlayer("setMedia", {
                    mp3: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/187048/PanamaHatNV_LOOP_CUT3.mp3",
                }).jPlayer("pause", 0);
            },

            //if the music ends start it over with the first jPlayer instance
            playing: function () {
                musicLoopTwo = setTimeout(function () {
                    if (gameState.playingGame) {
                        stopMusic();
                        $jPlayer.jPlayer("play");
                        gameState.musicLoopTwoActive = false;
                    }
                }, 102850);
                gameState.musicLoopTwoActive = true;
                gameState.playingMusic = true;
            },

            supplied: "mp3",
            wmode: "window",
        });
    }
}

//stop the music playback
function stopMusic() {
    $jPlayer.jPlayer('pause', 0);
    $jPlayer2.jPlayer('pause', 0);
    if (gameState.musicLoopOneActive) {
        clearTimeout(musicLoopOne);
        gameState.musicLoopOneActive = false;
    }
    if (gameState.musicLoopTwoActive) {
        clearTimeout(musicLoopTwo);
        gameState.musicLoopTwoActive = false;
    }
    gameState.playingMusic = false;
}

//stops and starts sound & music based on screen visibility
function muteOnVisibilityChange() {
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            createjs.Sound.stop();
            stopMusic();
        } else if (gameState.playingGame) {
            startMusic();
        }
    });
}

///////////////CODE TO BLOCK LONG CLICK MENU ON ANDROID///////////////

$(document)
    .on('touchstart touchmove touchend touchcancel', function (evt) {
        evt.preventDefault();
        evt.stopPropogation();
    });
