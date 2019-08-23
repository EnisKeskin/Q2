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
            questionTitle: '',
            answer0: '',
            answer1: '',
            answer2: '',
            answer3: '',
            file: '',
            questionErr: '',
            questionCount: null,
            questionSuccessfull: '',
            loginVisible: false,
        }

        this.onChangeFileEvent = this.onChangeFileEvent.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            const props = this.props.location;
            this.resetVariable();
            io = Io.connectionsRoom('profile', localStorage.getItem('token'));
            io.on('error', () => {
                this.setState({
                    loginVisible: true
                })
            })
            if (typeof (props).state !== 'undefined') {
                io.emit('questionCount', props.state.quizId);
                io.on('sendQuestionCount', (questionCount) => {
                    this.setState({
                        questionCount: questionCount + 1 + '. Question'
                    })
                })
            }
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
                this.setState({
                    questionErr: null,
                    questionSuccessfull: <div className="question-succes">Question created successfully You will be redirected in 1 second</div>
                })
                setTimeout(() => {
                    this.setState({
                        questionCount: quiz.questionCount + 1 + '. Question',
                    })
                    this.resetVariable();
                    this.resetForm();
                }, 1000);
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
        const props = this.props.location;
        this.question.answers = this.answers;
        if (typeof (props).state !== 'undefined') {
            this.question.quizId = props.state.quizId
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
            questionTitle: '',
            answer0: '',
            answer1: '',
            answer2: '',
            answer3: '',
            file: '',
            questionSuccessfull: '',
            questionErr: '',
            loginVisible: false,
        })
    }

    resetForm = () => {
        this.myFormRef.reset();
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
        console.log(index)
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

    render() {
        return (
            <div>
                {this.state.loginVisible ? <Redirect to='/User' /> :

                    <div className="capsule-2">

                        <header className="quiz-header question-header">
                            <div className="quiz-logo">
                                <img src={require('../images/logo/logo-w.png')} className="img-quiz-logo" accept="image/*" alt='' />

                            </div>
                            <Link to='/profile' className='question-finish'><button type="button" className="btn-finish"> Finish </button></Link>

                        </header>

                        <div className="container question-content">
                            <form action="." method="POST" ref={(el) => this.myFormRef = el}>
                                <div className="question-image">
                                    <label className="lbl-file" htmlFor="file">   Tap to add cover images    </label>
                                    <input className="fileupload" type="file" name="fileToUpload" id="file" accept="image/*" onChange={this.onChangeFileEvent} />
                                    <img src={this.state.file} alt='' srcSet='' />
                                </div>
                                <div className="question-text">
                                    <input type="text" className="txt-question" placeholder="Tap to add question" value={this.state.questionTitle || ''} onChange={this.onChangeTitleEvent.bind(this)} required />
                                </div>

                                <div className="question-answer">

                                    <div className="row">

                                        <div className="col-md-6 ">
                                            <div className="a1">
                                                <input type="text" className="txt-answer1" placeholder="Answer 1" value={this.state.answer0 || ''} onChange={this.onChangeAnswerEvent.bind(this, 0)} required />
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
                                                <input type="text" className="txt-answer2" placeholder="Answer 2" value={this.state.answer1 || ''} onChange={this.onChangeAnswerEvent.bind(this, 1)} required />
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
                                                <input type="text" className="txt-answer3" placeholder="Answer 3" value={this.state.answer2 || ''} onChange={this.onChangeAnswerEvent.bind(this, 2)} required />
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
                                                <input type="text" className="txt-answer4" placeholder="Answer 4" value={this.state.answer3 || ''} onChange={this.onChangeAnswerEvent.bind(this, 3)} required />
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
                                <div className="question-number">{this.state.questionCount}</div>
                                <div>{this.state.questionErr}</div>
                                {this.state.questionSuccessfull}
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