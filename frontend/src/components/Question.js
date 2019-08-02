import React, { Component } from 'react'
import Io from '../connection'
import { Link } from 'react-router-dom'

let io = null

class Question extends Component {

    constructor(props) {
        super(props);
        this.answers = [4];
        this.question = {
            quizId: "",
            questionTitle: "",
            answers: [],
            answer: 0,
            time: 0,
            img: "",
        }


        this.onChangeQuestionEvent = this.onChangeQuestionEvent.bind(this);
        this.onChangeAnswer1Event = this.onChangeAnswer1Event.bind(this);
        this.onChangeAnswer2Event = this.onChangeAnswer2Event.bind(this);
        this.onChangeAnswer3Event = this.onChangeAnswer3Event.bind(this);
        this.onChangeAnswer4Event = this.onChangeAnswer4Event.bind(this);
        this.onChangeTrueAnswerEvent = this.onChangeTrueAnswerEvent.bind(this);
        this.onChangeTimeEvent = this.onChangeTimeEvent.bind(this);
    }

    componentDidMount() {
        this.resetVariable();
        io = Io('profil', localStorage.getItem('token'));
        if (this.props.location.state.quizId) {
            this.question.quizId = this.props.location.state.quizId
        }

        io.on('newQuestionCreate', () => {
            
        })
    }

    onChangeQuestionEvent = (e) => {
        this.question.questionTitle = e.target.value
    }

    onChangeAnswer1Event = (e) => {
        this.answers[0] = e.target.value
    }

    onChangeAnswer2Event = (e) => {
        this.answers[1] = e.target.value
    }

    onChangeAnswer3Event = (e) => {
        this.answers[2] = e.target.value
    }

    onChangeAnswer4Event = (e) => {
        this.answers[3] = e.target.value
    }

    onChangeTrueAnswerEvent = (e) => {
        this.question.answer = e.target.value

    }

    onChangeTimeEvent = (e) => {
        this.question.time = e.target.value
    }

    onClickEvent = (e) => {
        e.preventDefault();
        this.resetForm()
        this.question.answers = this.answers;
        io.emit('addingQuestions', this.question );
    }

    resetVariable = () => {
        this.answers = [4];
        this.question = {
            quizId: "",
            questionTitle: "",
            answers: [],
            answer: 0,
            time: 0,
            img: "",
        }
    }

    resetForm = () => {
        this.myFormRef.reset();
    }

    render() {
        return (
            <div className="capsule-2">

                <header className="quiz-header">
                    <div className="quiz-logo">
                        <img src={require('../images/logo/logo-w.png')} className="img-quiz-logo" alt="" />

                    </div>

                    <div className="close">
                    <Link to='/profil'><img src={require('../images/quiz/cancel.png')} alt="" /></Link>
                        
                    </div>

                </header>

                <div className="container question-content">
                <form action="." method="POST" ref={(el) => this.myFormRef = el}>
                    <div className="question-image">
                    <label class="lbl-file" for="file">   Tap to add cover images    </label>
                    <input class="fileupload" type="file" name="fileToUpload" id="file"/>

                        <div className="select-box-question" onChange={this.onChangeTimeEvent} >
                            <select name="" id="" required>
                                <option value="0">Select Time</option>
                                <option value="10">10 sec </option>
                                <option value="20">20 sec </option>
                                <option value="30">30 sec </option>
                                <option value="40">40 sec </option>
                                <option value="50">50 sec </option>
                                <option value="60">60 sec </option>

                            </select>
                        </div>

                    </div>
                    <div className="question-text">

                        <input type="text" className="txt-question" placeholder="Tap to add question" onChange={this.onChangeQuestionEvent} required />

                    </div>

                    <div className="question-answer">

                        <div className="row">

                            <div className="col-md-6 ">
                                <div className="a1">
                                    <input type="text" className="txt-answer1" placeholder="Answer 1" onChange={this.onChangeAnswer1Event} required />
                                    <div className="checkbox">
                                        <input type="radio" name="option" value="1" onChange={this.onChangeTrueAnswerEvent} required />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="a2">
                                    <input type="text" className="txt-answer2" placeholder="Answer 2" onChange={this.onChangeAnswer2Event} required />
                                    <div className="checkbox">
                                        <input type="radio" name="option" value="2" onChange={this.onChangeTrueAnswerEvent} required />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 ">
                                <div className="a3">
                                    <input type="text" className="txt-answer3" placeholder="Answer 3" onChange={this.onChangeAnswer3Event} required />
                                    <div className="checkbox">
                                        <input type="radio" name="option" value="3" onChange={this.onChangeTrueAnswerEvent} required />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="a4">
                                    <input type="text" className="txt-answer4" placeholder="Answer 4" onChange={this.onChangeAnswer4Event} required />
                                    <div className="checkbox">
                                        <input type="radio" name="option" value="4" onChange={this.onChangeTrueAnswerEvent} required />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="add-question">
                        <button class="btn-add" type="submit" value="" onClick={this.onClickEvent} ></button>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default Question