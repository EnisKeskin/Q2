module.exports = class Player {
    constructor(username, socket, pin) {
        this.username = username;
        this.socket = socket;
        this.pin = pin;
        this.answers = [];
        this.totalPoint = 0;
    }

    calculateTotalPoints() {
        this.totalPoint = 0;
        for (let i = 0; i < this.answers.length; i++)
            this.totalPoint += this.answers[i].getPoint();
        return Math.floor(this.totalPoint);
    }
}