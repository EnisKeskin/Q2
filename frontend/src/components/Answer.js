import React, { Component } from 'react'
import io from '../connection';


class Answer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quiz: {},
            isVisible: false,
        }
    }

    componentDidMount() {
        io.emit('getQuiz');

        io.on('sendQuiz', (quiz) => {
            if (isNaN(quiz)) {
                console.log("Enis");
                this.setState({
                    quiz: quiz
                });
            };
        });
    };

    componentDidUpdate() {
        console.log(this.state.quiz[0].question[0].questionTitle);
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
                                {this.state.quiz[0].question[0].questionTitle}
                                <div className="triangle"></div>
                            </div>
                        </div>
                        <div className="progressbar">
                            {this.state.quiz[0].question[0].time}
                        </div>

                    </div>

                    <div className="answer-bottom">

                        <div className="container answer-bottom-in">
                            <div className="row">{console.log("at")}

                                <div className="col-md-6">
                                    <div className="answer-1">
                                        {this.state.quiz[0].question[0].answers[0]}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="answer-2">
                                        {this.state.quiz[0].question[0].answers[1]}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="answer-3">
                                        {this.state.quiz[0].question[0].answers[2]}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="answer-4">
                                        {this.state.quiz[0].question[0].answers[3]}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                    :
                    <div>
                        <div className="container answer-contet">

                            <div className="answer-top">
                                <div className="answer-image"></div>
                                <div className="answer-question">
                                    {/* {this.state.quiz[0].question[0].questionTitle} */}
                                    <div className="triangle"></div>
                                </div>
                            </div>
                            <div className="progressbar">
                                {/* {this.state.quiz[0].question[0].time} */}
                            </div>

                        </div>

                        <div className="answer-bottom">

                            <div className="container answer-bottom-in">
                                <div className="row">{console.log("at")}

                                    <div className="col-md-6">
                                        <div className="answer-1">
                                            {/* {this.state.quiz[0].question[0].answers[0]} */}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="answer-2">
                                            {/* {this.state.quiz[0].question[0].answers[1]} */}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="answer-3">
                                            {/* {this.state.quiz[0].question[0].answers[2]} */}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="answer-4">
                                            {/* {this.state.quiz[0].question[0].answers[3]} */}
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default Answer;