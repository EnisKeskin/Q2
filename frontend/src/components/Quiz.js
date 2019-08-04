import React, { Component } from 'react';
import Io from '../connection';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
// import Superagent from 'superagent';

let io = null;

class Quiz extends Component {

    constructor(props) {
        super(props);
        this.quizId = "";
        this.file = "";
        this.state = {
            location: "",
            language: "",
            title: "",
            description: "",
            img: "",
            loginVisible: false,
            questionVisible: false,
            question: [],
        }
        this.onChangeLocationEvent = this.onChangeLocationEvent.bind(this);
        this.onchangeLanguageEvent = this.onChangeLanguageEvent.bind(this);
        this.onChangeTitleEvent = this.onChangeTitleEvent.bind(this);
        this.onChangeDescAreaEvent = this.onChangeDescAreaEvent.bind(this);
        this.onChangeUploadEvent = this.onChangeUploadEvent.bind(this);
    }

    componentDidMount() {
        this.resetVarible();
        io = Io('profil', localStorage.getItem('token'));
        io.on('quizId', (quizId) => {
            this.quizId = quizId
            this.setState({
                questionVisible: true
            })
        });
    }

    onChangeLocationEvent = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    onChangeLanguageEvent = (e) => {
        this.setState({
            language: e.target.value
        })
    }

    onChangeTitleEvent = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    onChangeDescAreaEvent = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    onChangeUploadEvent = (e) => {
        this.file = e.target.files[0]
    }

    // console.log(this.props.location.state.id);
    onClickEvent = (e) => {
        e.preventDefault();
        let state = this.state;

        io.emit('quizCreate', {
            title: state.title,
            description: state.description,
            location: state.location,
            language: state.language,
            question: state.question,
        })
    }

    resetVarible = () => {
        this.quizId = "";
        this.setState({
            location: "",
            language: "",
            title: "",
            description: "",
            img: "",
            loginVisible: false,
            questionVisible: false,
            question: [],
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
                                    <Link to='/profil'><img src={require('../images/quiz/cancel.png')} alt="" /></Link>
                                </div>
                            </header>
                            <form action="." method="POST">
                                <div className="quiz-content">

                                    <div className="quiz-image">
                                        <label className="lbl-file" htmlFor="file">    Tap to add cover images   </label>

                                        <input className="fileupload" type="file" name="fileToUpload" id="file" encType="multipart/form-data" onChange={this.onChangeUploadEvent} />

                                    </div>

                                    <div className="quiz-right">

                                        <div className="dropdown">

                                            <div className="select-box select-box-1 ">
                                                <select name="" id="">
                                                    <option value="">Visible to  </option>
                                                    <option value="1">option 2</option>
                                                    <option value="1">option 3</option>
                                                    <option value="1">option 4</option>
                                                </select>
                                            </div>

                                            <div className="select-box select-box-2" onChange={this.onChangeLocationEvent}>
                                                <select required name="" id="">
                                                    <option value="">Location  </option>
                                                    <option value="Turkey">Turkey</option>
                                                    <option value="United States">United States</option>
                                                    <option value="Venezuela">Venezuela</option>
                                                </select>
                                            </div>

                                            <div className="select-box select-box-3" onChange={this.onChangeLanguageEvent}>
                                                <select required name="" id="">
                                                    <option value="">Language</option>
                                                    <option value="Turkish">Turkish</option>
                                                    <option value="English">English</option>
                                                    <option value="Spanish">Spanish</option>
                                                </select>
                                            </div>
                                        </div>

                                        <input type="text" placeholder="Title" className="txt-title" required onChange={this.onChangeTitleEvent} />

                                        <textarea placeholder="Description" className="txt-description" required onChange={this.onChangeDescAreaEvent} />

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