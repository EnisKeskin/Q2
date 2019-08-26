import React, { Component } from 'react'
import Io from '../connection';
import { Redirect } from 'react-router'
import Ip from '../Ip';

let io = null;

class Answer extends Component {
    constructor(props) {
        super(props);
        this.interval = 0;
        this.time = 0;

        this.state = {
            questionTitle: "",
            time: "",
            answers: "",
            answer: 0,
            progress: 100,
            img: "",
            isVisible: true,
            statistics: false,
            visible: false,
            a: 0, b: 0, c: 0, d: 0,
        }
    }

    componentDidMount() {
        let props = this.props;
        let propsLocation = props.location;
        if (typeof (propsLocation.state) !== 'undefined') {
            if (propsLocation.state.visible) {
                this.setState({
                    visible: false
                });
                props.history.replace({ state: {} });
            } else {
                this.setState({
                    visible: true
                });
                props.history.replace({ state: {} });
            }
        } else {
            this.setState({
                visible: true
            });
        }
        io = Io.connectionsRoom('game');
        io.on('newQuestion', (question) => {
            if (isNaN(question)) {
                this.setState({
                    questionTitle: question.questionTitle,
                    time: question.time,
                    answers: question.answers,
                    answer: question.answer,
                    img: question.img,
                    progress: 100,
                    isVisible: true,
                    statistics: false,
                    visible: false,
                    a: 0, b: 0, c: 0, d: 0,
                });
                this.interval = 0;
                this.time = 0;
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
                    if (statisticsInfo) {
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
                    }
                });
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
        });

        io.on('showScoreboard', () => {
            this.setState({
                isVisible: false,
                statistics: false,
            });
        })
    };

    componentWillUnmount() {
        io.removeListener('showScoreboard');
        io.removeListener('staticstics');
        io.removeListener('newQuestion');
    };

    componentDidUpdate() {
        if (this.state.time === 0) {
            clearInterval(this.interval);
        };
    };

    onCLickEvent(answer, e) {
        document.querySelectorAll('.col-md-6').forEach((block) => {

            if (!(block.children[0] === e.target)) {
                block.children[0].style.background = "grey";
                block.children[0].style.boxShadow = "rgb(111, 103, 103) 2px 2px 2px 2px";
            }
            block.children[0].style.boxShadow = "rgb(111, 103, 103) 2px 2px 2px 2px";
            block.style.pointerEvents = "none";

        });
        io.emit('sendAnswer', { answer });
    };

    render() {
        return (

            <div>
                {this.state.visible ?
                    <Redirect to='/' />
                    :
                    <div>
                        {this.state.isVisible ?
                            <div>
                                <div className="container answer-contet">


                                    <div className="answer-top-in">
                                        <div className="answer-image">
                                            <img src={`${Ip}${this.state.img}`} alt="" srcSet="" />
                                        </div>
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
                            <div>
                                {this.state.statistics ?
                                    <div>
                                        <div className="container answer-contet">

                                            <div className="answer-top">

                                                <div className="statistics">
                                                    <div className="statistics-item">
                                                        <span className="statistics-item-label">{this.state.a}</span>
                                                        <div className="statistics-item-fill statistics-item-fill-1" style={{ 'height': `${Math.max(5, Math.min(((this.state.a) * 20), 120))}px` }} ></div>
                                                    </div>

                                                    <div className="statistics-item">
                                                        <span className="statistics-item-label">{this.state.b}</span>
                                                        <div className="statistics-item-fill statistics-item-fill-2" style={{ 'height': `${Math.max(5, Math.min(((this.state.b) * 20), 120))}px` }} ></div>
                                                    </div>

                                                    <div className="statistics-item">
                                                        <span className="statistics-item-label">{this.state.c}</span>
                                                        <div className="statistics-item-fill statistics-item-fill-3" style={{ 'height': `${Math.max(5, Math.min(((this.state.c) * 20), 120))}px` }} ></div>
                                                    </div>

                                                    <div className="statistics-item">
                                                        <span className="statistics-item-label">{this.state.d}</span>
                                                        <div className="statistics-item-fill statistics-item-fill-4" style={{ 'height': `${Math.max(5, Math.min(((this.state.d) * 20), 120))}px` }} ></div>
                                                    </div>

                                                </div>

                                                <div className="progressbar"></div>
                                            </div>

                                            <div className="answer-bottom">

                                                <div className="container answer-bottom-in">

                                                    <div className="row">

                                                        <div className="col-md-6">
                                                            <div className="answer-1">{this.state.answers[0]}</div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="answer-2">{this.state.answers[1]}</div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="answer-3">{this.state.answers[2]}</div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="answer-4">{this.state.answers[3]}</div>
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                    : <Redirect to={
                                        {
                                            pathname: '/Scoreboard',
                                            state: { visible: true }
                                        }
                                    } />
                                }
                            </div>
                        }

                    </div>
                }
            </div>
        )
    }
}

export default Answer;