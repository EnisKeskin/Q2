module.exports = class Answer {
    constructor(timestart, timeend, totaltime, answer, isCorrect) {
        this.time = (timeend - timestart) / totaltime;
        this.socket = socket;
        this.answer = answer;
        this.isCorrect = isCorrect;
    }

    getPoint() {
        return this.isCorrect ? this.time * point : 0;
    }
}