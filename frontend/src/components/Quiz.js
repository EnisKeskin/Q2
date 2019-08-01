import React, { Component } from 'react'
import Io from '../connection';
import { Redirect } from 'react-router'

let io = null;

class Quiz extends Component {

    constructor(props) {
        super(props);
        this.quizId = "";
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
        //     this.onChangeRUserEvent = this.onChangeRUserEvent.bind(this);
    }

    componentDidMount() {
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

    // console.log(this.props.location.state.id);
    onClickEvent = () => {
        let state = this.state;
        io.emit('quizCreate', {
            title: state.title,
            description: state.description,
            location: state.location,
            language: state.language,
            question: state.question,
            pin: 21222,
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
                        <div>
                            <header className="quiz-header">
                                <div className="quiz-logo">
                                    <img src="images/logo/logo-w.png" className="img-quiz-logo" alt="" />
                                </div>
                            </header>

                            <div className="quiz-content">

                                <div className="quiz-image">
                                    <img src="images/thumb-1920-943148.jpg" alt="" />
                                </div>

                                <div className="quiz-right">
                                    <div className="dropdown">

                                        <div className="select-box select-box-1 ">
                                            <select name="" id="" >
                                                <option value="1">Visible to </option>
                                                <option value="1">option 2</option>
                                                <option value="1">option 3</option>
                                                <option value="1">option 4</option>
                                            </select>
                                        </div>

                                        <div className="select-box select-box-2" onChange={this.onChangeLocationEvent}>
                                            <select name="" id="">
                                                <option value="Turkey">Turkey </option>
                                                <option value="Germany">Germany</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Egypt">Egypt</option>
                                            </select>
                                        </div>

                                        <div className="select-box select-box-3" onChange={this.onChangeLanguageEvent}>
                                            <select name="" id="">
                                                <option value="Turkish">Turkish</option>
                                                <option value="German">German</option>
                                                <option value="English">English</option>
                                                <option value="Arabic">Arabic</option>
                                            </select>
                                        </div>

                                    </div>
                                    <input type="text" placeholder="Title" className="txt-title" onChange={this.onChangeTitleEvent} />
                                    <textarea placeholder="Description" className="txt-description" onChange={this.onChangeDescAreaEvent} />
                                </div>
                            </div>

                            <div className="quiz-enter-button">
                                <button type="button" className="btn-quiz-enter" onClick={this.onClickEvent}>Enter</button>
                            </div>
                        </div>

                }
            </div>
        )
    }
}

export default Quiz;