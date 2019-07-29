module.exports = class Answer {
    constructor(timestart, timeend, answer, isCorrect) {
        this.time = timeend - timestart;
        this.socket = socket;
        this.answer = answer;
        this.isCorrect = isCorrect;
    }

    setTime(totaltime){
        time /= totaltime;
    }

    getPoint() {
        return this.isCorrect ? this.time * point : 0;
    }
}