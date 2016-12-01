var writeChar = function(someOutput, characterToWrite) {
    someOutput.append(characterToWrite); 
}

var writePrompt = function(listOfPrompts, listOfAnswers, someOutput, someContent) {
    if(someContent == undefined || someContent == "") {
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
        } else {
            if(listOfPrompts.length != 0) {
                toOutput = listOfPrompts[0];
                newAnswers = listOfAnswers;
                newPrompts = listOfPrompts.slice(1);
            } else{
                return;
            }
        }
        if(someOutput != undefined) {
            someOutput.removeClass("active");
        }
        var promptDom = $("<p><p>");
        $('body').append(promptDom);
        writePrompt(newPrompts, newAnswers, promptDom, toOutput);
        return;

    }
    var INITIAL_MULTIPLIER = 20;
    var delayFunction = function() { return Math.round(Math.random() * INITIAL_MULTIPLIER) + 10};
    setTimeout(function() {
        var currentChar = someContent.charAt(0);
        someOutput.addClass("active");
        writeChar(someOutput, currentChar);
        writePrompt(listOfPrompts, listOfAnswers, someOutput, someContent.substring(1));
    }, delayFunction());
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
    var promptContents = new Array();
    var answerContents = new Array();
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
})