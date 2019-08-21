import React, { Component } from 'react'
import Io from '../connection'
import { Link } from 'react-router-dom'
import Superagent from 'superagent';
import { Redirect } from 'react-router'
import Ip from '../Ip'

let io = null

class Question extends Component {

    constructor(props) {
        super(props);
        this.file = '';
        this.answers = [];
        this.question = {
            quizId: '',
            questionTitle: '',
            answers: [],
            answer: null,
            time: 0,
            img: '',
        }
        this.state = {
            file: '',
            questionErr: '',
            loginVisible: false,
        }

        this.onChangeFileEvent = this.onChangeFileEvent.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            this.resetVariable();
            io = Io.connectionsRoom('profile', localStorage.getItem('token'));
            io.on('error', () => {
                this.setState({
                    loginVisible: true
                })
            })
            io.on('newQuestionCreate', (quiz) => {
                if (this.file) {
                    Superagent
                        .post(`${Ip}api/upload`)
                        .field('questionId', quiz.questionId)
                        .field('whereToIns', 'question')
                        .attach("theFile", this.file)
                        .end((err, result) => {
                            if (err)
                                throw err

                        })
                }
                this.resetVariable();
                this.resetForm();
            })

            io.on('errors', (question) => {
                this.setState({
                    questionErr: <div className="question-error">
                        {question.message}
                    </div>
                })
            })
        } else {
            this.setState({
                loginVisible: true
            })
        }
    }

    componentWillUnmount() {
        if (localStorage.getItem('token')) {
            io.removeListener('error');
            io.removeListener('newQuestionCreate');
            io.removeListener('errors');
        }
    }

    onChangeFileEvent = (e) => {
        const file = e.target.files[0];

        if (typeof (file) !== 'undefined') {
            const splite = file.type.split('/');
            if (splite[0] === 'image') {
                this.file = file;
                this.setState({
                    file: URL.createObjectURL(file)
                });
            } else {
                this.file = null;
                this.setState({
                    file: null
                });
            }
        }
    }

    onClickEvent = (e) => {
        e.preventDefault();
        this.question.answers = this.answers;
        if (this.props.location.state.quizId) {
            this.question.quizId = this.props.location.state.quizId
        }
        io.emit('addingQuestions', this.question);
    }

    resetVariable = () => {
        this.answers = ['', '', '', ''];
        this.question = {
            quizId: '',
            questionTitle: '',
            answers: [],
            answer: null,
            time: 0,
            img: '',
        }
        this.setState({
            file: '',
            questionErr: '',
        })
    }

    resetForm = () => {
        this.myFormRef.reset();
    }

    render() {
        return (
            <div>
                {this.state.loginVisible ? <Redirect to='/User' /> :

                    <div className="capsule-2">

                        <header className="quiz-header">
                            <div className="quiz-logo">
                                <img src={require('../images/logo/logo-w.png')} className="img-quiz-logo" accept="image/*" alt='' />

                            </div>

                            <div className="close">
                                <Link to='/profile'><img src={require('../images/quiz/cancel.png')} alt='' /></Link>

                            </div>

                        </header>

                        <div className="container question-content">
                            <form action="." method="POST" ref={(el) => this.myFormRef = el}>
                                <div className="question-image">
                                    <label className="lbl-file" htmlFor="file">   Tap to add cover images    </label>
                                    <input className="fileupload" type="file" name="fileToUpload" id="file" accept="image/*" onChange={this.onChangeFileEvent} />
                                    <img src={this.state.file} alt='' srcSet='' />
                                    <div className="select-box-question" >
                                        <select name='' id='' required onChange={(e) => { this.question.time = e.target.value }}>
                                            <option value="-1">Select Time</option>
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
                                    {/* kısa bicimde yaz */}
                                    <input type="text" className="txt-question" placeholder="Tap to add question" onChange={(e) => { this.question.questionTitle = e.target.value }} required />

                                </div>

                                <div className="question-answer">

                                    <div className="row">

                                        <div className="col-md-6 ">
                                            <div className="a1">
                                                <input type="text" className="txt-answer1" placeholder="Answer 1" onChange={(e) => { this.answers[0] = e.target.value }} required />
                                                <div className="checkbox">
                                                    {/* onChange Çalışmayabiliyor */}
                                                    <input type="radio" name="option" value="0" onChange={(e) => {
                                                        this.question.answer = e.target.value
                                                    }} required />
                                                    <label>Option 1</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="a2">
                                                <input type="text" className="txt-answer2" placeholder="Answer 2" onChange={(e) => { this.answers[1] = e.target.value }} required />
                                                <div className="checkbox">
                                                    <input type="radio" name="option" value="1" onChange={(e) => {
                                                        this.question.answer = e.target.value
                                                    }} required />
                                                    <label>Option 1</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6 ">
                                            <div className="a3">
                                                <input type="text" className="txt-answer3" placeholder="Answer 3" onChange={(e) => { this.answers[2] = e.target.value }} required />
                                                <div className="checkbox">
                                                    <input type="radio" name="option" value="2" onChange={(e) => {
                                                        this.question.answer = e.target.value
                                                    }} required />
                                                    <label>Option 1</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="a4">
                                                <input type="text" className="txt-answer4" placeholder="Answer 4" onChange={(e) => { this.answers[3] = e.target.value }} required />
                                                <div className="checkbox">
                                                    <input type="radio" name="option" value="3" onChange={(e) => {
                                                        this.question.answer = e.target.value
                                                    }} required />
                                                    <label>Option 1</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div>{this.state.questionErr}</div>
                                <div className="add-question">
                                    <button className="btn-add" type="submit" value='' onClick={this.onClickEvent} ></button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
export default Question