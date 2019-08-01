module.exports = class Answer {
    constructor(timestart, timeend, answer, isCorrect) {
        this.time = timeend - timestart;
        this.answer = answer;
        this.isCorrect = isCorrect;
    }

    setTime(totaltime) {
        this.time /= totaltime;
    }

    getPoint() {
        return this.isCorrect ? point * (2 - this.time) : 0;
    }
}