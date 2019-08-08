module.exports = class Answer {
    constructor(timestart, timeend, totaltime, answer, isCorrect) {
        this.time = (timeend - timestart) / totaltime;
        this.answer = answer;
        this.isCorrect = isCorrect;
    }

    getPoint() {
        return this.isCorrect ? point * (2 - this.time) : 0;
    }
}