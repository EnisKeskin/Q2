module.exports = class Player {
    constructor(username, socket, pin) {
        this.username = username;
        this.socket = socket;
        this.pin = pin;
        this.answers = [];
        this.totalPoint = 0;
    }

    fillAnswers(count) {
        for (let i = 0; i < count; i++)
            this.answers.push({ isNull: true });
    }

    calculateTotalPoints() {
        this.totalPoint = 0;
        this.answers.forEach((answer) => {
            if (!answer["isNull"])
                this.totalPoint += answer.getPoint();
        });
        return Math.floor(this.totalPoint);
    }
}