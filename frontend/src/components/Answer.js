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
            answer: "",
            quiz: {},
            progress: 100,
            isVisible: false,
            statistics: false
        }
    }

    componentDidMount() {
        io.emit('getQuiz');
        io.on('sendQuiz', (quiz) => {
            if (isNaN(quiz)) {
                this.setState({
                    quiz: quiz,
                    questionTitle: quiz[0].question[0].questionTitle,
                    time: quiz[0].question[0].time,
                    answers: quiz[0].question[0].answers,
                    answer: quiz[0].question[0].answer,
                    progress: 100,
                    isVisible: true
                });
                this.numofques = quiz[0].question.length;
                console.log(this.props.location.state.id);
                this.time = quiz[0].question[0].time;
                this.interval = setInterval(() => {
                    this.setState({
                        time: (this.state.time - 1),
                        progress: this.state.progress - (100 / this.time)
                    });
                }, 1000);

            };
        });
    };
    //serdada 10 sn başlıcak zaman oldu statictis ekranana yollucak
    //router üzerinden gidilicek
    componentDidUpdate() {
        if (this.state.time === 0) {
            clearInterval(this.interval);
            this.number += 1;

            if (this.numofques !== this.number) {
                console.log("at");
                this.setState({
                    isVisible: false,
                    statistics: true,
                })
                console.log(this.state.isVisible);

            } else {
                //scoreboard gidicek
            }

        }
    }

    // this.setState({
    //     questionTitle: this.state.quiz[0].question[this.number].questionTitle,
    //     time: this.state.quiz[0].question[this.number].time,
    //     answers: this.state.quiz[0].question[this.number].answers,
    //     answer: this.state.quiz[0].question[this.number].answer,
    //     progress: 100,
    //     isVisible: true
    // });
    // this.time = this.state.quiz[0].question[this.number].time;

    // this.interval = setInterval(() => {
    //     this.setState({
    //         time: (this.state.time - 1),
    //         progress: this.state.progress - (100 / this.time)
    //     })
    // }, 1000);

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
                                        <div className="answer-1">
                                            {this.state.answers[0]}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="answer-2">
                                            {this.state.answers[1]}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="answer-3">
                                            {this.state.answers[2]}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="answer-4">
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
                                                <img src="images/thumb-1920-943148.jpg" alt="" /></div>

                                            <div class="answer-question">

                                                Lorem ipsum dolor sit amet, consectetur
                                                adipiscing elit. Quisque nec finibus?
                                      <div class="triangle"></div>

                                            </div>
                                        </div>

                                        <div class="statistics">
                                            <div class="statistics-item">
                                                <span class="statistics-item-label">10</span>
                                                <div class="statistics-item-fill statistics-item-fill-1" ></div>
                                            </div>

                                            <div class="statistics-item">
                                                <span class="statistics-item-label">10</span>
                                                <div class="statistics-item-fill statistics-item-fill-2" ></div>
                                            </div>

                                            <div class="statistics-item">
                                                <span class="statistics-item-label">10</span>
                                                <div class="statistics-item-fill statistics-item-fill-3" ></div>
                                            </div>

                                            <div class="statistics-item">
                                                <span class="statistics-item-label">10</span>
                                                <div class="statistics-item-fill statistics-item-fill-4" ></div>
                                            </div>

                                        </div>

                                        <div class="progressbar"></div>
                                    </div>

                                    <div class="answer-bottom">

                                        <div class="container answer-bottom-in">

                                            <div class="row">

                                                <div class="col-md-6">
                                                    <div class="answer-1">Answer 1</div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="answer-2"> Answer 2</div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="answer-3"> Answer 3</div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="answer-4"> Answer 4 </div>
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