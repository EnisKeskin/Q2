import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import Io from '../connection';
import Header from './static/Header'
import Ip from '../Ip'

let io = null;

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profilImg: "",
            user: {},
            username: "",
            fullname: "",
            quizs: [],
            loginVisible: false,
            quizCount: 0,
            file: "",
            token: "",
        }
    }

    componentDidMount() {
        this.resetVariable();
        let token = localStorage.getItem('token');
        if (token) {
            this.setState({
                token: token
            })
            io = Io.connectionsRoom('profile', token);
            io.emit('getProfilInfo');

            io.on('error', () => {
                this.setState({
                    loginVisible: true
                });
            });

            io.on('setProfilInfo', (user) => {
                this.setState({
                    user,
                    username: user.username,
                    fullname: user.firstname + " " + user.lastname
                });
            });

            io.on('profilQuiz', (quizs) => {
                this.setState({
                    quizs,
                    quizCount: quizs.length
                });
            });
            
        } else {
            this.setState({
                loginVisible: true
            })
        }
    }

    componentWillUnmount() {
        if (this.state.token) {
            io.removeListener('error');
            io.removeListener('setProfilInfo');
            io.removeListener('profilQuiz');
        }
    }

    resetVariable = () => {
        this.setState({
            profilImg: "",
            username: "",
            fullname: "",
            quizs: [],
            loginVisible: false,
            quizCount: 0,
            file: "",
        })
    }

    onClickEvent = (quizId, e) => {
        const confirm = window.confirm('Are you sure you want to delete');
        if (confirm) {
            io.emit('quizDel', quizId);
            io.emit('getProfilInfo');
        }
    }

    quizDelete = (quizId) => {
        io.emit('quizDel', quizId);
        io.emit('getProfilInfo');
    }

    quizModel() {
        const stateQuizs = this.state.quizs;
        const quizs = [];
        stateQuizs.forEach((quiz, key) => {
            quizs.push(
                <div key={key}>
                    <div data-toggle="modal" data-target={"#quiz-item-modal" + key} className="my-quiz">

                        <div className="my-quiz-img">
                            <img src={quiz.img !== '' ? `${Ip}${quiz.img}` : require('../images/quiz/defaultQuiz.png')} className="img-quiz" alt="" />
                        </div>

                        <div className="my-quiz-name">
                            {quiz.title}
                        </div>

                        <div className="my-quiz-question">{quiz.questionCount > 0 ? quiz.questionCount : this.quizDelete(quiz._id)} Question</div>

                    </div>

                    <div className="modal fade bd-example-modal-lg" id={"quiz-item-modal" + key} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
                        aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">

                            <div className="modal-content">

                                <div className="container-fluid">
                                    <div className="row">

                                        <div className="col-lg-6 modal-left">
                                            <img src={quiz.img !== '' ? `${Ip}${quiz.img}` : require('../images/quiz/defaultQuiz.png')} className="img-modal" alt="" />
                                        </div>

                                        <div className="col-lg-6 modal-right">

                                            <h4 className="h4 modal-h4">{quiz.title}</h4>

                                            <div className="modal-user">
                                                <img src={quiz.userImg !== '' ? `${Ip}${quiz.userImg}` : require('../images/quiz/avatar2.png')} className="img-user-modal" alt="" />

                                                <div className="modal-name">{quiz.username}</div>

                                                <div className="modal-star">
                                                    <Link to={{ pathname: '/Quiz/Edit', state: { quizId: quiz._id } }} >
                                                        <img src={require('../images/quiz/edit.png')} alt="" className="img-delete" />
                                                    </Link>
                                                    <img src={require('../images/quiz/delete.png')} className="img-delete" alt="" data-dismiss="modal" onClick={this.onClickEvent.bind(this, quiz._id)} />
                                                </div>

                                            </div>

                                            <h5 className="h5-subtitle">Description</h5>

                                            <p> {quiz.description} </p>
                                            <div className="modal-start">
                                                <Link to={{ pathname: '/Lobby', state: { pin: quiz.pin, visible: true } }} className="btn-play">Play</Link>
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div >

            )
        });
        return quizs;
    }

    render() {
        let state = this.state;
        return (

            <div>
                <script src="../javascripts/main"></script>
                {state.loginVisible ?
                    <Redirect to='/User' />
                    :
                    <div className="capsule-2">
                        <Header />
                        <Link to="#" className="mobil-profil">Profil</Link>
                        <div className="content">

                            <div className="content-profil" id="profil">
                                <Link to='#' className="profil-close">
                                    <img src={require('../images/quiz/cancel.png')} alt="" />
                                </Link>
                                <div className="profil-top">
                                    <div className="profil-img">
                                        <img src={typeof (state.user.img) !== 'undefined' ? `${Ip}${state.user.img}` : require('../images/quiz/avatar2.png')} className="img-profil" alt="" />
                                    </div>

                                    <div className="profil-name">
                                        {/* isim soy isim */}
                                        <h6 className="h6">{state.fullname} <Link to="/Profile/Edit"><img src={require('../images/user-icon/edit.png')} className="img-edit"
                                            alt="Edit" /> </Link> </h6>
                                        {/* kullanıcıadı */}
                                        <h6 className="h6-mail"> {state.username} </h6>
                                    </div>

                                </div>

                                <div className="profil-bottom">

                                    <div className="row">

                                        <div className="col-lg-12 ">
                                            <div className="profil-information-left">
                                                <div>Quiz Created </div>
                                                <div> {state.quizCount} </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-12">

                                            <div className=" profil-information-right">
                                                <div> Hosted Games </div>
                                                <div> {state.quizCount} </div>

                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="content-right">
                                <div className="content-menu">
                                    <ul>
                                        <li><Link className="active" to="#">My Quiz</Link></li>
                                    </ul>
                                </div>

                                {this.quizModel()}

                            </div>

                        </div>

                    </div>
                }

            </div>

        )
    }
}
export default Profile;