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
        this.onChangeTrueAnswerEvent = this.onChangeTrueAnswerEvent.bind(this);
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
    //validatonlar kontrol edilecek
    componentDidMount() {
        let token = localStorage.getItem('token')
        let propsState = this.props.location.state;
        if (token) {
            io = Io.connectionsRoom('profile', token);
            if (typeof (propsState) !== 'undefined') {
                const questionId = propsState.questionId;
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
                    io.emit('questionDeleteImg', quiz.questionId);
                    Superagent
                        .post(`${Ip}api/upload`)
                        .field('questionId', quiz.questionId)
                        .field('whereToIns', 'question')
                        .attach("theFile", this.file)
                        .end((err, result) => {
                            if (err)
                                throw err
                        });
                }
            })

            io.on('errors', (question) => {
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
                loginVisible: true,
            });
        }
    }

    componentWillUnmount() {
        if (localStorage.getItem('token')) {
            io.removeListener('error');
            io.removeListener('questionUpdateImg');
            io.removeListener('errors');
            io.removeListener('questUpdateSuccess');
            io.removeListener('sendQuestionInfo');
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
        this.question.answers = this.answers;
        io.emit('questionUpdate', this.question);
    }

    onChangeTitleEvent = (e) => {
        const value = e.target.value
        if (value.length <= 100) {
            this.question.questionTitle = value;
            this.setState({
                questionTitle: value
            });
        }
    }

    onChangeAnswerEvent = (index, e) => {
        const value = e.target.value
        if (value.length <= 100) {
            this.answers[index] = value
            switch (index) {
                case 0:
                    this.setState({
                        answer0: value
                    })
                    break;
                case 1:
                    this.setState({
                        answer1: value
                    })
                    break; case 2:
                    this.setState({
                        answer2: value
                    })
                    break; case 3:
                    this.setState({
                        answer3: value
                    })
                    break;
                default:
                    break;
            }

        }
    }

    onChangeTrueAnswerEvent = (e) => {
        const value = e.target.value;
        this.question.answer = value
        this.setState({ answer: value })
    }

    render() {
        let state = this.state
        return (
            <div>
                {state.visible ?
                    <Redirect to='/Quiz/Edit' />
                    : <div>
                        {state.loginVisible ? <Redirect to='/User' /> :

                            <div className="capsule-2">

                                <header className="quiz-header question-header">
                                    <div className="quiz-logo">
                                        <img src={require('../images/logo/logo-w.png')} className="img-quiz-logo" accept="image/*" alt='' />

                                    </div>
                                    <Link to={{ pathname: '/Quiz/Edit', state: { quizId: this.props.location.state.quizId } }} className='question-finish'><button type="button" className="btn-finish" onClick={this.onClickEvent}> Finish </button></Link>

                                </header>
                                <div className="container question-content">
                                    <form action="." method="POST" ref={(el) => this.myFormRef = el}>
                                        <div className="question-image">
                                            <label className="lbl-file" htmlFor="file">   Tap to add cover images    </label>
                                            <input className="fileupload" type="file" name="fileToUpload" id="file" accept="image/*" onChange={this.onChangeFileEvent} />
                                            <img src={state.file || `${Ip}${state.img}`} alt='' srcSet='' />
                                        </div>
                                        <div className="question-text">
                                            {/* kısa bicimde yaz */}
                                            <input type="text" className="txt-question" placeholder="Tap to add question" value={state.questionTitle || ''} onChange={this.onChangeTitleEvent.bind(this)} required />

                                        </div>

                                        <div className="question-answer">

                                            <div className="row">

                                                <div className="col-md-6 ">
                                                    <div className="a1">
                                                        <input type="text" className="txt-answer1" placeholder="Answer 1" value={state.answer0 || ''} onChange={this.onChangeAnswerEvent.bind(this, 0)} required />
                                                        <div className="checkbox">
                                                            {/* onChange Çalışmayabiliyor */}
                                                            <input type="radio" name="option" value="0" checked={state.answer === 0 ? "checked" : ''} onChange={this.onChangeTrueAnswerEvent} required />
                                                            <label>Option 1</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="a2">
                                                        <input type="text" className="txt-answer2" placeholder="Answer 2" value={state.answer1 || ''} onChange={this.onChangeAnswerEvent.bind(this, 1)} required />
                                                        <div className="checkbox">
                                                            <input type="radio" name="option" value="1" checked={state.answer === 1 ? "checked" : ''} onChange={this.onChangeTrueAnswerEvent} required />
                                                            <label>Option 1</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6 ">
                                                    <div className="a3">
                                                        <input type="text" className="txt-answer3" placeholder="Answer 3" value={state.answer2 || ''} onChange={this.onChangeAnswerEvent.bind(this, 2)} required />
                                                        <div className="checkbox">
                                                            <input type="radio" name="option" value="2" checked={state.answer === 2 ? "checked" : ''} onChange={this.onChangeTrueAnswerEvent} required />
                                                            <label>Option 1</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="a4">
                                                        <input type="text" className="txt-answer4" placeholder="Answer 4" value={state.answer3 || ''} onChange={this.onChangeAnswerEvent.bind(this, 3)} required />
                                                        <div className="checkbox">
                                                            <input type="radio" name="option" value="3" checked={state.answer === 3 ? "checked" : ''} onChange={this.onChangeTrueAnswerEvent} required />
                                                            <label>Option 1</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="select-box-question" >
                                            <select value={state.time || 'DEFAULT'} onChange={(e) => { this.question.time = e.target.value; this.setState({ time: e.target.value }) }} >
                                                <option value={'DEFAULT'}>Select Time</option>
                                                <option value={10}>10 sec </option>
                                                <option value={20}>20 sec </option>
                                                <option value={30}>30 sec </option>
                                                <option value={40}>40 sec </option>
                                                <option value={50}>50 sec </option>
                                                <option value={60}>60 sec </option>
                                            </select>
                                        </div>
                                        <div>{state.questionErr || state.questionSucces}</div>
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