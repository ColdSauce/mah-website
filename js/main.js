/*
The following code is taken from this stackoverflow question https://stackoverflow.com/questions/17433015/change-the-hue-of-a-rgb-color-in-javascript
*/
// Changes the RGB/HEX temporarily to a HSL-Value, modifies that value 
// and changes it back to RGB/HEX.

function changeHue(rgb, degree) {
    var hsl = rgbToHSL(rgb);
    hsl.h += degree;
    if (hsl.h > 360) {
        hsl.h -= 360;
    }
    else if (hsl.h < 0) {
        hsl.h += 360;
    }
    return hslToRGB(hsl);
}

// exepcts a string and returns an object
function rgbToHSL(rgb) {
    // strip the leading # if it's there
    rgb = rgb.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(rgb.length == 3){
        rgb = rgb.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(rgb.substr(0, 2), 16) / 255,
        g = parseInt(rgb.substr(2, 2), 16) / 255,
        b = parseInt(rgb.substr(4, 2), 16) / 255,
        cMax = Math.max(r, g, b),
        cMin = Math.min(r, g, b),
        delta = cMax - cMin,
        l = (cMax + cMin) / 2,
        h = 0,
        s = 0;

    if (delta == 0) {
        h = 0;
    }
    else if (cMax == r) {
        h = 60 * (((g - b) / delta) % 6);
    }
    else if (cMax == g) {
        h = 60 * (((b - r) / delta) + 2);
    }
    else {
        h = 60 * (((r - g) / delta) + 4);
    }

    if (delta == 0) {
        s = 0;
    }
    else {
        s = (delta/(1-Math.abs(2*l - 1)))
    }

    return {
        h: h,
        s: s,
        l: l
    }
}

// expects an object and returns a string
function hslToRGB(hsl) {
    var h = hsl.h,
        s = hsl.s,
        l = hsl.l,
        c = (1 - Math.abs(2*l - 1)) * s,
        x = c * ( 1 - Math.abs((h / 60 ) % 2 - 1 )),
        m = l - c/ 2,
        r, g, b;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else {
        r = c;
        g = 0;
        b = x;
    }

    r = normalize_rgb_value(r, m);
    g = normalize_rgb_value(g, m);
    b = normalize_rgb_value(b, m);

    return rgbToHex(r,g,b);
}

function normalize_rgb_value(color, m) {
    color = Math.floor((color + m) * 255);
    if (color < 0) {
        color = 0;
    }
    return color;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


var writeChar = function(someOutput, characterToWrite, nextCharToWrite, finalCharacter) {
    someOutput.append(characterToWrite, nextCharToWrite, finalCharacter); 
}

var globalMultiplier = 1;
var delayFunction = function(INITIAL_MULTIPLIER) {
    globalMultiplier = 1/Math.pow(2,globalMultiplier);
    return Math.round(Math.random() * INITIAL_MULTIPLIER * globalMultiplier);
};
var writePrompt = function(listOfPrompts, listOfAnswers, someOutput, someContent, colorOfText, isAnswer) {
    if(someContent == undefined) {
        toOutput = listOfPrompts[0];
        newAnswers = listOfAnswers;
        newPrompts = listOfPrompts.slice(1);
        var promptDom = $("<span></span>");
        promptDom.append("<br>");
        promptDom.css("color", colorOfText);
        $('termcontainer').append(promptDom);
        writePrompt(newPrompts, newAnswers, promptDom, toOutput,changeHue(colorOfText, 2));
        return;
    } else if(someContent == "") {
        var toOutput = null;
        var newPrompts = null;
        var newAnswers = null;
        
        if(listOfPrompts.length < listOfAnswers.length) {
            toOutput = listOfAnswers[0];
            newAnswers = listOfAnswers.slice(1);
            newPrompts = listOfPrompts;
        } else if(listOfPrompts.length > listOfAnswers.length) {
            toOutput = listOfPrompts[0];
            newAnswers = listOfAnswers;
            newPrompts = listOfPrompts.slice(1);
        } else if(listOfPrompts.length != 0){
            toOutput = listOfPrompts[0];
            newAnswers = listOfAnswers;
            newPrompts = listOfPrompts.slice(1);
        } else {
            return;
        }

        if(isAnswer) {     someOutput.addClass("answer") }
        someOutput.removeClass("active");

        var promptDom = $("<span></span>");
        promptDom.append("<br>");
        promptDom.css("color", colorOfText);
        $('.termcontainer').append(promptDom);
        writePrompt(newPrompts, newAnswers, promptDom, toOutput, changeHue(colorOfText, 2));
        return;

    }
    var INITIAL_MULTIPLIER = 5;
    setTimeout(function() {
        var currentChar = someContent.charAt(0);
        var nextChar = someContent.charAt(1);
        var finalCharacter = someContent.charAt(2);
        someOutput.addClass("active");
        writeChar(someOutput, currentChar, nextChar, finalCharacter);
        writePrompt(listOfPrompts, listOfAnswers, someOutput, someContent.substring(3), colorOfText);
        someOutput.removeClass("active");
    }, delayFunction(INITIAL_MULTIPLIER));
}

var cleanup = function() {
    var prompts = $('.prompts');
    var answers = $('.answers');
    prompts.remove();
    answers.remove();
}

$(document).ready(function() {
    var prompts = $('.prompts p');
    var answers = $('.answers p')
    promptContents = prompts.map(function(index) {
        var currentText = $(this).text();
        return currentText;
    });

    answerContents = answers.map(function(index) {
        var currentText = $(this).text();
        return currentText;
    });
    cleanup();

    writePrompt(promptContents, answerContents, undefined, undefined, "#55ff55");
});




