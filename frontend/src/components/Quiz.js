import React, { Component } from 'react';
import Io from '../connection';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Superagent from 'superagent';
import Ip from '../Ip'

let io = null;

class Quiz extends Component {

    constructor(props) {
        super(props);
        this.quizId = "";
        this.file = "";
        this.quiz = {
            location: "",
            language: "",
            title: "",
            description: "",
            img: "",
            question: [],
            visibleTo: false,
        }
        this.state = {
            loginVisible: false,
            questionVisible: false,
            file: "",
            quizError: "",
        }
        this.onChangeUploadEvent = this.onChangeUploadEvent.bind(this);
        this.onChangeVisibleToEvent = this.onChangeVisibleToEvent.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            this.resetVarible();
            io = Io.connectionsRoom('profile', localStorage.getItem('token'));

            io.on('error', () => {
                this.setState({
                    loginVisible: true
                });
            });

            io.on('quizId', (quizId) => {
                if (this.file) {
                    Superagent
                        .post(`${Ip}api/upload`)
                        .field('quizId', quizId)
                        .field('whereToIns', 'quiz')
                        .attach("theFile", this.file)
                        .end((err, result) => {
                            if (err)
                                throw err
                            console.log(result);
                        })
                }
                this.quizId = quizId
                this.setState({
                    questionVisible: true
                })
            });

            io.on('quizError', (quiz) => {
                this.setState({
                    quizError:
                        <div className="quiz-error">{quiz.message}</div>
                });
            });

        } else {
            this.setState({
                loginVisible: true
            })
        }
    }

    componentWillUnmount() {
        if (localStorage.getItem('token')) {
            io.removeListener('error');
            io.removeListener('quizId');
            io.removeListener('quizError');
        }
    }

    onChangeUploadEvent = (e) => {
        const splite = e.target.files[0].type.split('/');
        if (splite[0] === 'image') {
            this.file = e.target.files[0];
            this.setState({
                file: URL.createObjectURL(e.target.files[0])
            });
        } else {
            this.file = null;
            this.setState({
                file: null
            });
        }
    }

    onClickEvent = (e) => {
        e.preventDefault();
        io.emit('quizCreate', this.quiz);
    }

    onChangeVisibleToEvent = (e) => {
        if (e.target.value === "1") {
            this.quiz.visibleTo = true
        } else {
            this.quiz.visibleTo = false
        }
    }

    resetVarible = () => {
        this.quizId = "";
        this.file = "";
        this.quiz = {
            location: "",
            language: "",
            title: "",
            description: "",
            img: "",
            question: [],
            visibleTo: false,
        };
        this.setState(
            {
                loginVisible: false,
                questionVisible: false,
                file: "",
                quizError: "",
            })
    }

    render() {
        return (
            <div>
                {this.state.loginVisible ?
                    <Redirect to="/user" />
                    :
                    this.state.questionVisible ?
                        <Redirect to={
                            {
                                pathname: '/question',
                                state: { quizId: this.quizId }
                            }
                        } />
                        :
                        <div className="capsule-2">
                            <header className="quiz-header">
                                <div className="quiz-logo">
                                    <img src={require('../images/logo/logo-w.png')} className="img-quiz-logo" alt="" />
                                </div>
                                <div className="close">
                                    <Link to='/profile'><img src={require('../images/quiz/cancel.png')} alt="" /></Link>
                                </div>
                            </header>
                            <form action="." method="POST">
                                <div className="quiz-content">

                                    <div className="quiz-image">
                                        <label className="lbl-file" htmlFor="file">    Tap to add cover images   </label>

                                        <input className="fileupload" type="file" name="fileToUpload" id="file" accept="image/*" encType="multipart/form-data" onChange={this.onChangeUploadEvent} />
                                        <img src={this.state.file} alt="" />
                                    </div>

                                    <div className="quiz-right">

                                        <div className="dropdown">

                                            <div className="select-box select-box-1 ">
                                                <select name="" id="" onChange={this.onChangeVisibleToEvent}>
                                                    <option value="">Visible to </option>
                                                    <option value="0">Private</option>
                                                    <option value="1">Public</option>
                                                </select>
                                            </div>

                                            <div className="select-box select-box-2" onChange={(e) => { this.quiz.location = e.target.value }}>
                                                <select required name="" id="">
                                                    <option value="">Location  </option>
                                                    <option value="Turkey">Turkey</option>
                                                    <option value="United States">United States</option>
                                                    <option value="Venezuela">Venezuela</option>
                                                </select>
                                            </div>

                                            <div className="select-box select-box-3" onChange={(e) => { this.quiz.language = e.target.value }}>
                                                <select required name="" id="">
                                                    <option value="">Language</option>
                                                    <option value="Turkish">Turkish</option>
                                                    <option value="English">English</option>
                                                    <option value="Spanish">Spanish</option>
                                                </select>
                                            </div>
                                        </div>

                                        <input type="text" placeholder="Title" className="txt-title" required onChange={(e) => { this.quiz.title = e.target.value }} />

                                        <textarea placeholder="Description" className="txt-description" required onChange={(e) => { this.quiz.description = e.target.value }} />
                                        {this.state.quizError}
                                    </div>

                                </div>
                                <div className="quiz-enter-button">
                                    <button type="submit" className="btn-quiz-enter" onClick={this.onClickEvent} >Enter</button>
                                </div>
                            </form>
                        </div>


                }
            </div>
        )
    }
}

export default Quiz;