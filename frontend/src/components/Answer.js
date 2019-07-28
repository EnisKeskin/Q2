import React, { Component } from 'react'
import io from '../connection';

class Answer extends Component {
    constructor(props) {
        super(props);
        this.interval = 0;
        this.time = 0;
        this.number = 0;
        this.numofques = 0;

        this.state = {
            questionTitle: "",
            time: "",
            answers: "",
            answer: 0,
            progress: 100,
            isVisible: false,
            statistics: false,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
        }
    }

    componentDidMount() {
        io.on('newQuestion', (question) => {
            if (isNaN(question)) {

                this.setState({
                    questionTitle: question.questionTitle,
                    time: question.time,
                    answers: question.answers,
                    answer: question.answer,
                    progress: 100,
                    isVisible: true,
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0,
                });
                this.interval = 0;
                this.time = 0;
                this.number = 0;
                this.numofques = 0;
                // console.log(this.props.location.state.id);

                this.time = question.time;

                this.interval = setInterval(() => {

                    this.setState({
                        time: (this.state.time - 1),
                        progress: this.state.progress - (100 / this.time)
                    });

                }, 1000);

            };

        });

        io.on('staticstics', (statistics) => {
            if (isNaN(statistics)) {
                statistics.forEach((statisticsInfo) => {
                    switch (statisticsInfo.answer) {
                        case 0:
                            this.setState({
                                a: this.state.a + 1
                            })
                            break;
                        case 1:
                            this.setState({
                                b: this.state.b + 1
                            })
                            break;
                        case 2:
                            this.setState({
                                c: this.state.c + 1
                            })
                            break;
                        case 3:
                            this.setState({
                                d: this.state.d + 1
                            })
                            break;

                        default:
                            break;
                    }
                    this.setState({
                        isVisible: false,
                        statistics: true,
                    });
                    if (this.state.statistics === true) {
                        const choiceLen = document.querySelectorAll('.col-md-6').length;
                        for (let i = 0; i < choiceLen; i++) {
                            if (i !== this.state.answer) {
                                document.querySelectorAll('.col-md-6').item(i).children[0].style.background = "grey";
                            }
                            document.querySelectorAll('.col-md-6').item(i).children[0].style.pointerEvents = "none";
                        }
                    }
                })
            }
        });
    };
    //serdada 10 sn başlıcak zaman oldu statictis ekranana yollucak
    //router üzerinden gidilicek
    componentDidUpdate() {
        if (this.state.time === 0) {
            clearInterval(this.interval);
        };

    }

    onCLickEvent(answer, e) {
        document.querySelectorAll('.col-md-6').forEach((block) => {

            if (!(block.children[0] === e.target)) {
                block.children[0].style.background = "grey";
            }

            block.style.pointerEvents = "none";

        });

        io.emit('sendAnswer', { answer });

    }
    render() {
        return (
            <div>
                {this.state.isVisible ?
                    <div>
                        <div className="container answer-contet">

                            <div className="answer-top">
                                <div className="answer-image"></div>
                                <div className="answer-question">
                                    {this.state.questionTitle}
                                    <div className="triangle"></div>
                                </div>
                            </div>
                            <div className="progressbar" style={{ 'width': `${this.state.progress}%` }}>
                                {this.state.time}
                            </div>

                        </div>

                        <div className="answer-bottom">

                            <div className="container answer-bottom-in">
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="answer-1" onClick={this.onCLickEvent.bind(this, 0)}>
                                            {this.state.answers[0]}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="answer-2" onClick={this.onCLickEvent.bind(this, 1)}>
                                            {this.state.answers[1]}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="answer-3" onClick={this.onCLickEvent.bind(this, 2)}>
                                            {this.state.answers[2]}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="answer-4" onClick={this.onCLickEvent.bind(this, 3)}>
                                            {this.state.answers[3]}
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                    :
                    // bu kod ayrı yazılacak sonra buraya extend edilecek.
                    <div>
                        {this.state.statistics ?
                            <div>

                                <div class="container answer-contet">

                                    <div class="answer-top">

                                        <div class="answer-top-in">

                                            <div class="answer-image">
                                                <img src="images/thumb-1920-943148.jpg" alt="" />
                                            </div>

                                            <div class="answer-question">

                                                Lorem ipsum dolor sit amet, consectetur
                                                adipiscing elit. Quisque nec finibus?
                                            <div class="triangle"></div>

                                            </div>
                                        </div>

                                        <div class="statistics">
                                            <div class="statistics-item">
                                                <span class="statistics-item-label">{this.state.a}</span>
                                                <div class="statistics-item-fill statistics-item-fill-1" style={{ 'height': `${Math.max(5, Math.min(((this.state.a) * 20), 120))}px` }} ></div>
                                            </div>

                                            <div class="statistics-item">
                                                <span class="statistics-item-label">{this.state.b}</span>
                                                <div class="statistics-item-fill statistics-item-fill-2" style={{ 'height': `${Math.max(5, Math.min(((this.state.b) * 20), 120))}px` }} ></div>
                                            </div>

                                            <div class="statistics-item">
                                                <span class="statistics-item-label">{this.state.c}</span>
                                                <div class="statistics-item-fill statistics-item-fill-3" style={{ 'height': `${Math.max(5, Math.min(((this.state.c) * 20), 120))}px` }} ></div>
                                            </div>

                                            <div class="statistics-item">
                                                <span class="statistics-item-label">{this.state.d}</span>
                                                <div class="statistics-item-fill statistics-item-fill-4" style={{ 'height': `${Math.max(5, Math.min(((this.state.d) * 20), 120))}px` }} ></div>
                                            </div>

                                        </div>

                                        <div class="progressbar"></div>
                                    </div>

                                    <div class="answer-bottom">

                                        <div class="container answer-bottom-in">

                                            <div class="row">

                                                <div class="col-md-6">
                                                    <div class="answer-1">{this.state.answers[0]}</div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="answer-2">{this.state.answers[1]}</div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="answer-3">{this.state.answers[2]}</div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="answer-4">{this.state.answers[3]}</div>
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                            : null
                        }
                    </div>
                }

            </div>
        )
    }
}

export default Answer;