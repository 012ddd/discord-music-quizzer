const finish = require("./finish");
const handleSkip = require("./handleSkip");
const nextSong = require("./nextSong");
const printStatus = require("./printStatus");
const reactToMessage = require("./reactToMessage");
const stringSimilarity = require("string-similarity");

module.exports = async function(message, response, stopCommand, skipCommand) {
    if (response.author.bot) return;
    const quiz = message.guild.quiz;
    const content = response.content.toLowerCase();
    if (content === stopCommand) {
        await printStatus(message, response, 'Quiz stopped!');
        await finish(message);

        return
    }

    if (content === skipCommand) {
        await handleSkip(message, response, response.author.id);

        return;
    }

    const song = quiz.songs[quiz.currentSong];
    let score = quiz.scores[response.author.id] || 0;
    let correct = false;

    if (!quiz.titleGuessed && stringSimilarity.compareTwoStrings(content, song.title.toLowerCase()) >= 0.65) {
        score = score + 2;
        quiz.titleGuessed = true;
        correct = true;
        await reactToMessage(quiz, response, '☑');
    }

    if (!quiz.artistGuessed && stringSimilarity.compareTwoStrings(content, song.artist.toLowerCase()) >= 0.75) {
        score = score + 3;
        quiz.artistGuessed = true;
        correct = true;
        await reactToMessage(quiz, response, '☑');
    }
    quiz.scores[response.author.id] = score;

    if (quiz.titleGuessed && quiz.artistGuessed) {
        nextSong(message, response, 'Song guessed!');
    }

    if (!correct) {
        await reactToMessage(quiz, response, '❌');
    }
}