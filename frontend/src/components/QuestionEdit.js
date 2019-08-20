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
        this.questionId = '';
        this.question = {
            quizId: '',
            questionTitle: '',
            answers: [],
            answer: -1,
            time: 0,
            img: '',
        }
        this.state = {
            questionTitle: '',
            answer0: '',
            answer1: '',
            answer2: '',
            answer3: '',
            answer: -1,
            time: 0,
            img: '',
            file: '',
            questionErr: '',
            loginVisible: false,
            visible: false
        }

        this.onChangeFileEvent = this.onChangeFileEvent.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (typeof (props.location.state) !== 'undefined') {
            if (props.location.state.questionId) {
                return state.visible = false;
            } else {
                return state.visible = true;
            }
        } else {
            return state.visible = true;
        }
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            io = Io.connectionsRoom('profile', localStorage.getItem('token'));
            if (typeof (this.props.location.state) !== 'undefined') {
                const questionId = this.props.location.state.questionId;
                if (questionId) {
                    this.questionId = questionId;
                } else {
                    this.questionId = '';
                }
                if (this.questionId !== '') {
                    io.emit('reqQuestionInfo', this.questionId)
                    io.on('sendQuestionInfo', (question) => {
                        this.setState({
                            questionTitle: question.questionTitle,
                            answer0: question.answers[0],
                            answer1: question.answers[1],
                            answer2: question.answers[2],
                            answer3: question.answers[3],
                            answer: question.answer,
                            time: question.time,
                            img: question.img,
                        });
                        this.answers = question.answers;
                        this.question = question;
                    })
                }
            }
            io.on('error', () => {
                this.setState({
                    loginVisible: true
                })
            })
            io.on('questionUpdateImg', (quiz) => {
                if (this.file) {
                    Superagent
                        .post(`${Ip}api/upload`)
                        .field('questionId', quiz.questionId)
                        .field('whereToIns', 'question')
                        .attach("theFile", this.file)
                        .end((err, result) => {
                            if (err)
                                throw err
                            console.log(result);
                        });
                }
            })

            io.on('questionErr', (question) => {
                this.setState({
                    questionSucces: null,
                    questionErr: <div className="question-error">
                        {question.message}
                    </div>
                });
            });

            io.on('questUpdateSuccess', (msg) => {
                this.setState({
                    questionErr: null,
                    questionSucces: <div className="login-succes sign-err">{msg}</div>
                })
            })

        } else {
            this.setState({
                loginVisible: true
            });
        }
    }

    componentWillUnmount() {
        if (localStorage.getItem('token')) {
            io.removeListener('error');
            io.removeListener('questionUpdateImg');
            io.removeListener('questionErr');
            io.removeListener('questUpdateSuccess');

        }
    }

    onChangeFileEvent = (e) => {
        this.file = e.target.files[0];
        this.setState({
            file: URL.createObjectURL(e.target.files[0])
        })
    }

    onClickEvent = (e) => {
        e.preventDefault();
        this.question.answers = this.answers;
        io.emit('questionUpdate', this.question);
    }

    render() {
        return (
            <div>
                {this.state.visible ?
                    <Redirect to='/QuizEdit' />
                    : <div>
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
                                            <img src={this.state.file || `${Ip}${this.state.img}`} alt='' srcSet='' />
                                            <div className="select-box-question" >
                                                <select value={this.state.time || 'DEFAULT'} onChange={(e) => { this.question.time = e.target.value; this.setState({ time: e.target.value }) }} >
                                                    <option value={'DEFAULT'}>Select Time</option>
                                                    <option value={10}>10 sec </option>
                                                    <option value={20}>20 sec </option>
                                                    <option value={30}>30 sec </option>
                                                    <option value={40}>40 sec </option>
                                                    <option value={50}>50 sec </option>
                                                    <option value={60}>60 sec </option>
                                                </select>
                                            </div>

                                        </div>
                                        <div className="question-text">
                                            {/* kısa bicimde yaz */}
                                            <input type="text" className="txt-question" placeholder="Tap to add question" value={this.state.questionTitle || ''} onChange={(e) => { this.question.questionTitle = e.target.value; this.setState({ questionTitle: e.target.value }) }} required />

                                        </div>

                                        <div className="question-answer">

                                            <div className="row">

                                                <div className="col-md-6 ">
                                                    <div className="a1">
                                                        <input type="text" className="txt-answer1" placeholder="Answer 1" value={this.state.answer0 || ''} onChange={(e) => { this.answers[0] = e.target.value; this.setState({ answer0: e.target.value }) }} required />
                                                        <div className="checkbox">
                                                            {/* onChange Çalışmayabiliyor */}
                                                            <input type="radio" name="option" value="0" checked={this.state.answer === 0 ? "checked" : ''} onChange={(e) => {
                                                                console.log(e.target.value);
                                                                this.question.answer = e.target.value
                                                                this.setState({ answer: 0 })
                                                            }} required />
                                                            <label>Option 1</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="a2">
                                                        <input type="text" className="txt-answer2" placeholder="Answer 2" value={this.state.answer1 || ''} onChange={(e) => { this.answers[1] = e.target.value; this.setState({ answer1: e.target.value }) }} required />
                                                        <div className="checkbox">
                                                            <input type="radio" name="option" value="1" checked={this.state.answer === 1 ? "checked" : ''} onChange={(e) => {
                                                                console.log(e.target.value);
                                                                this.question.answer = e.target.value
                                                                this.setState({ answer: 1 })
                                                            }} required />
                                                            <label>Option 1</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 ">
                                                    <div className="a3">
                                                        <input type="text" className="txt-answer3" placeholder="Answer 3" value={this.state.answer2 || ''} onChange={(e) => { this.answers[2] = e.target.value; this.setState({ answer2: e.target.value }) }} required />
                                                        <div className="checkbox">
                                                            <input type="radio" name="option" value="2" checked={this.state.answer === 2 ? "checked" : ''} onChange={(e) => {
                                                                console.log(e.target.value);
                                                                this.question.answer = e.target.value
                                                                this.setState({ answer: 2 })
                                                            }} required />
                                                            <label>Option 1</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="a4">
                                                        <input type="text" className="txt-answer4" placeholder="Answer 4" value={this.state.answer3 || ''} onChange={(e) => { this.answers[3] = e.target.value; this.setState({ answer3: e.target.value }) }} required />
                                                        <div className="checkbox">
                                                            <input type="radio" name="option" value="3" checked={this.state.answer === 3 ? "checked" : ''} onChange={(e) => {
                                                                console.log(e.target.value);
                                                                this.question.answer = e.target.value
                                                                this.setState({ answer: 3 })
                                                            }} required />
                                                            <label>Option 1</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div>{this.state.questionErr || this.state.questionSucces}</div>
                                        <div className="add-question">
                                            <button className="btn-add" type="submit" onClick={this.onClickEvent} ></button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>

        )
    }
}
export default Question