import React, { Component } from 'react';
import Io from '../connection';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Superagent from 'superagent';
import Ip from '../Ip'
import Slider from "react-slick";

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
            title: '',
            location: '',
            language: '',
            description: '',
            img: '',
            questions: [],
            loginVisible: false,
            visibleTo: '',
            visible: false,
            file: "",
            quizError: "",
        }
        this.onChangeUploadEvent = this.onChangeUploadEvent.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (typeof (props.location.state) !== 'undefined') {
            if (props.location.state.quizId) {
                return state.visible = false;
            } else {
                return state.visible = true;
            }
        } else {
            return state.visible = true;
        }
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        const propsState = this.props.location.state;
        if (token) {
            if (document.querySelector('.modal-backdrop')) {
                document.querySelector('body').classList.remove("modal-open");
                document.querySelector('.modal-backdrop').remove();
            }
            io = Io.connectionsRoom('profile', token);

            io.on('error', () => {
                this.setState({
                    loginVisible: true
                });
            });

            if (typeof (propsState) !== 'undefined') {
                const quizId = propsState.quizId;
                if (quizId) {
                    this.quizId = quizId;
                } else {
                    this.quizId = '';
                }
                if (this.quizId !== '') {
                    io.emit('reqQuizInfo', this.quizId)
                    io.on('sendQuizInfo', (quiz) => {
                        if (quiz !== null) {
                            if (typeof (quiz.question[0]) !== 'undefined') {
                                this.setState({
                                    title: quiz.title,
                                    description: quiz.description,
                                    img: quiz.img,
                                    questions: quiz.question,
                                    visibleTo: quiz.visibleTo,
                                    location: quiz.location,
                                    language: quiz.language,
                                });
                                this.quiz = quiz;
                            } else {
                                io.emit('quizDel', this.quizId);
                                this.setState({
                                    loginVisible: true
                                })
                            }
                        } else {
                            this.setState({
                                loginVisible: true
                            })
                        }
                    })
                }
            }

            io.on('quizUpdateFile', () => {
                if (this.file) {
                    io.emit('quizDeleteImg', this.quizId);
                    Superagent
                        .post(`${Ip}api/upload`)
                        .field('quizId', this.quizId)
                        .field('whereToIns', 'quiz')
                        .attach("theFile", this.file)
                        .end((err, result) => {
                            if (err)
                                throw err
                        })
                }
            });

            io.on('errors', (quiz) => {
                this.setState({
                    quizError:
                        <div className="quiz-error">{quiz.message}</div>
                });
            });

            io.on('quizUpdateSuccess', (msg) => {
                this.setState({
                    quizError: null,
                    questionSucces: <div className="quiz-succes">{msg}</div>
                })
            })

        } else {
            this.setState({
                loginVisible: true
            })
        }
    }

    onClickDeleteQuestionEvent = (id, e) => {
        if (window.confirm('Are you sure you want to delete')) {
            io.emit('questionDelete', id);
            window.location.reload();
        }
    }

    onChangeUploadEvent = (e) => {
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
        io.emit('quizUpdate', this.quiz);
    }

    questionShow = () => {
        const questions = [];
        this.state.questions.forEach((question, key) => {
            questions.push(
                <div className="questions-image-in" key={key}>
                    <div className="question-delete"><img src={require('../images/quiz/cancel.png')} alt="" onClick={this.onClickDeleteQuestionEvent.bind(this, question._id)} /></div>
                    <Link to={{ pathname: '/Question/Edit', state: { questionId: question._id, quizId: this.props.location.state.quizId } }}>

                        <div className="q-image">
                            <img src={question.img !== '' ? `${Ip}${question.img}` : require('../images/quiz/default-quiz.png')} alt="" />
                        </div>
                        <div className="spn-questions">{question.questionTitle}</div>
                    </Link>
                </div>
            )
        })
        return questions
    }

    componentWillUnmount() {
        if (localStorage.getItem('token')) {
            io.removeListener('error');
            io.removeListener('quizId');
            io.removeListener('errors');
            io.removeListener('sendQuizInfo');
            io.removeListener('quizUpdateSuccess');
            io.removeListener('quizUpdateFile');
        }
    }

    onChangeTitleEvent = (e) => {
        const value = e.target.value;
        if (value.length <= 100) {
            this.quiz.title = value;
            this.setState({
                title: value
            });
        }
    }

    onChangeDescriptionEvent = (e) => {
        const value = e.target.value;
        if (value.length <= 256) {
            this.quiz.description = value
            this.setState({
                description: value
            });
        }
    }

    render() {
        const discoverBottom = {
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1300,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: false,
                    }
                }
                ,

                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: false,
                    }
                }
            ]
        };
        const state = this.state
        return (
            <div>
                {state.visible ?
                    <div>
                        <Redirect to='/Profile' />
                    </div>
                    :
                    <div>
                        {state.loginVisible ?
                            <Redirect to="/user" />
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
                                            <img src={this.state.file || `${Ip}${state.img}`} alt="" />
                                        </div>

                                        <div className="quiz-right">

                                            <div className="dropdown">

                                                <div className="select-box select-box-1 ">
                                                    <select value={state.visibleTo.toString() || 'DEFAULT'} onChange={(e) => { this.quiz.visibleTo = e.target.value; this.setState({ visibleTo: e.target.value }); }}>
                                                        <option value={"DEFAULT"}>Visible to </option>
                                                        <option value={false}>Private</option>
                                                        <option value={true}>Public</option>
                                                    </select>
                                                </div>

                                                <div className="select-box select-box-2">
                                                    <select value={state.location.toString() || 'DEFAULT'} onChange={(e) => { this.quiz.location = e.target.value; this.setState({ location: e.target.value }) }}>
                                                        <option value={"DEFAULT"}>Location  </option>
                                                        <option value={"Turkey"}>Turkey</option>
                                                        <option value={"United States"}>United States</option>
                                                        <option value={"Venezuela"}>Venezuela</option>
                                                    </select>
                                                </div>

                                                <div className="select-box select-box-3">
                                                    <select value={state.language.toString() || 'DEFAULT'} onChange={(e) => { this.quiz.language = e.target.value; this.setState({ language: e.target.value }) }}>
                                                        <option value={"DEFAULT"}>Language</option>
                                                        <option value={"Turkish"}>Turkish</option>
                                                        <option value={"English"}>English</option>
                                                        <option value={"Spanish"}>Spanish</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <input type="text" placeholder="Title" className="txt-title" value={state.title || ''} onChange={this.onChangeTitleEvent.bind(this)} />
                                            <div className="description">
                                                <textarea placeholder="Description" className="txt-description" value={state.description || ''} onChange={this.onChangeDescriptionEvent.bind(this)} />Character {256 - (this.state.description.length) || '0'}</div>

                                            {this.state.quizError || this.state.questionSucces}
                                        </div>

                                    </div>
                                    <div className="quiz-questions">

                                        <div className="quiz-question-header">
                                            <h2>Questions</h2>
                                            <Link to={{ pathname: '/question', state: { quizId: this.quizId } }} > <button type="button" className="btn-question-add"></button> </Link>
                                        </div>

                                        <Slider className="questions-image" {...discoverBottom}>{this.questionShow()}</Slider>

                                        <div className="quiz-enter-button">
                                            <button type="submit" className="btn-quiz-enter" onClick={this.onClickEvent} >Edit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
}

export default Quiz;