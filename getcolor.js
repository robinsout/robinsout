var submitButton = document.getElementById('getNameButton');
submitButton.addEventListener('click', getName);

var inputField = document.getElementById('inputString');
inputField.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        getName();
    }
});

function setContrastTextColor(resultColor) {
    // extracting RGB from hex
    var bgColor = resultColor.substring(1); // truncate "#" sign
    var rgb = parseInt(bgColor, 16);
    var r = (rgb >> 16) & 0xff;
    var g = (rgb >>  8) & 0xff;
    var b = (rgb >>  0) & 0xff;

    var brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b; //calculating brightness of background color

    if (brightness < 125) { // change text color to white
        document.getElementById('titleName').style.color = 'white'; 
        document.getElementById('displayColorName').style.color = 'white';

    }
    else if (brightness >= 125) { // change text color to black
        document.getElementById('titleName').style.color = 'black'; 
        document.getElementById('displayColorName').style.color = 'black';
    }
}

function loadColorListAndDisplayColor(inputWord) {
    var xhr = new XMLHttpRequest();
    var responseJsonData;
    xhr.open('GET', './getcolors.php', true);
    xhr.onload = function load() {
        if (this.status === 200) { // Got answer
            responseJsonData = JSON.parse(this.responseText);
            resultColor = findColor(responseJsonData, inputWord);
            displayResults(resultColor);
        } else {
            console.log('Error! Color list not loaded!'); // Something's not right, no answer
        }
    }
    xhr.send();
}

function displayResults (resultColor) {
    document.getElementById('displayColorName').innerHTML = resultColor.name + '<br>' + resultColor.hexColor; // Display found color name and hex
    document.body.style.backgroundColor = resultColor.hexColor; // Fill page background with found color
    setContrastTextColor(resultColor.hexColor);
}

function findColor (responseJsonData, inputWord) {
    
    var inputColor = truncateHash(getHash(inputWord));
    var closestColorHex = '#000000';
    var closestColor;
    inputWord = inputWord.toLowerCase();
    for (let i = 0; i < responseJsonData.colors.length; i++) {

        // if found exact color name or keyword display correspoding color
        if (inputWord === responseJsonData.colors[i].name.toLowerCase() ||
            inputWord === responseJsonData.colors[i].hexColor.toLowerCase() ||
            inputWord === truncateSharpSign(responseJsonData.colors[i].hexColor).toLowerCase() ||
            inputWord === responseJsonData.colors[i].alt_name1.toLowerCase() ||
            inputWord === responseJsonData.colors[i].alt_name2.toLowerCase() ||
            inputWord === responseJsonData.colors[i].alt_name3.toLowerCase()) {
            closestColor = responseJsonData.colors[i];
            break;
        }
        // else search for matching color in regular way
        else if (closestColorHex === 0 || Math.abs(parseInt(truncateSharpSign(closestColorHex), 16) - parseInt(inputColor, 16)) > Math.abs(parseInt(truncateSharpSign(responseJsonData.colors[i].hexColor), 16) - parseInt(inputColor, 16))) {
            closestColorHex = responseJsonData.colors[i].hexColor;
            closestColor = responseJsonData.colors[i];
        }
    }
    return(closestColor);
}


// Button click
function getName() {
    var inputName = document.getElementById('inputString');
    if (inputName.value !== '') {
        loadColorListAndDisplayColor(inputName.value); // Process input word
    }
    else {
        alert('Please enter a word'); // Field is empty
    }
    
}

function getHash(inputString) {
    var hash = md5(inputString); // Get md5 hash of entered string
    return hash;
}

function truncateHash(inputHash) {
    /*
    var shortHash = '';
    for (var i=0; i<=5; i++) { // Truncate md5 hash to match #XXXXXX hex color format, leave first 6 chars
        shortHash += inputHash.charAt(i);
    }
    return shortHash; */
    return inputHash.substring(0,6);
}

function truncateSharpSign(colorWithSharpSign) {
/*
    var shortHash = '';
    for (var i=1; i<=6; i++) { // Truncate '#' hash-sign
        shortHash += colorWithSharpSign.charAt(i); 
    }
    return shortHash;
*/
    return colorWithSharpSign.substring(1,7);
}
