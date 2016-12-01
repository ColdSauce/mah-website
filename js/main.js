var writeChar = function(someOutput, characterToWrite) {
    someOutput.append(characterToWrite); 
}

var globalMultiplier = 1;
var delayFunction = function(INITIAL_MULTIPLIER) {
    globalMultiplier = 1/Math.pow(2,globalMultiplier);
    return Math.round(Math.random() * INITIAL_MULTIPLIER * globalMultiplier);
};
var writePrompt = function(listOfPrompts, listOfAnswers, someOutput, someContent, isAnswer) {
    if(someContent == undefined) {
        toOutput = listOfPrompts[0];
        newAnswers = listOfAnswers;
        newPrompts = listOfPrompts.slice(1);
        var promptDom = $("<span></span>");
        promptDom.append("<br>");
        $('termcontainer').append(promptDom);
        writePrompt(newPrompts, newAnswers, promptDom, toOutput);
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

        if(isAnswer) {
            someOutput.addClass("answer")
        }
        someOutput.removeClass("active");

        var promptDom = $("<span></span>");
        promptDom.append("<br>");
        $('.termcontainer').append(promptDom);
        writePrompt(newPrompts, newAnswers, promptDom, toOutput);
        return;

    }
    var INITIAL_MULTIPLIER = 5;
    setTimeout(function() {
        var currentChar = someContent.charAt(0);
        someOutput.addClass("active");
        writeChar(someOutput, currentChar);
        writePrompt(listOfPrompts, listOfAnswers, someOutput, someContent.substring(1));
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

    writePrompt(promptContents, answerContents);
});