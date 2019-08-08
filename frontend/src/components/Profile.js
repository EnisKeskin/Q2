import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import Io from '../connection';
import Header from './static/Header'

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
        this.resetVariable()
        if (localStorage.getItem('token')) {
            this.setState({
                token: localStorage.getItem('token')
            })
            io = Io.connectionsRoom('profile', localStorage.getItem('token'));
            io.emit('getProfilInfo');
            io.on('error', () => {
                this.setState({
                    loginVisible: true
                })
            })
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
    quizModel() {
        const stateQuizs = this.state.quizs;
        const quizs = [];
        stateQuizs.forEach((quiz, key) => {
            quizs.push(
                <div key={key}>
                    <div data-toggle="modal" data-target={"#quiz-item-modal" + key} className="my-quiz">

                        <div className="my-quiz-img">
                            <img src={`http://localhost:3000/${quiz.img}`} className="img-quiz" alt="" />
                        </div>

                        <div className="my-quiz-name">
                            {quiz.title}
                        </div>

                    </div>

                    <div className="modal fade bd-example-modal-lg" id={"quiz-item-modal" + key} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
                        aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">

                            <div className="modal-content">

                                <div className="container-fluid">
                                    <div className="row">

                                        <div className="col-lg-6 modal-left">
                                            <img src={`http://localhost:3000/${quiz.img}`} className="img-modal" alt="" />
                                        </div>

                                        <div className="col-lg-6 modal-right">

                                            <h4 className="h4 modal-h4">{quiz.title}</h4>

                                            <div className="modal-user">

                                                <img src={`http://localhost:3000/${quiz.img}`} className="img-user-modal" alt="" />

                                                <div className="modal-name">{quiz.username}</div>

                                                <div className="modal-star">

                                                    <img src={require('../images/quiz/delete.png')} className="img-delete" alt="" />
                                                </div>

                                            </div>

                                            <h5 className="h5-subtitle">Description</h5>

                                            <p> {quiz.description} </p>
                                            <div className="modal-start">
                                                <Link to={{ pathname: '/Players', state: { pin: quiz.pin } }} className="btn-play">Play</Link>
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            )
        });
        return quizs;
    }

    render() {
        return (

            <div>
                <script src="../javascripts/main"></script>
                {this.state.loginVisible ?
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
                                        <img src={require('../images/quiz/quiz.png')} className="img-profil" alt="" />
                                    </div>

                                    <div className="profil-name">
                                        {/* isim soy isim */}
                                        <h6 className="h6">{this.state.fullname} <Link to="#"><img src={require('../images/user-icon/edit.png')} className="img-edit"
                                            alt="Edit" /> </Link> </h6>
                                        {/* kullanıcıadı */}
                                        <h6 className="h6-mail"> {this.state.username} </h6>
                                    </div>

                                </div>

                                <div className="profil-bottom">

                                    <div className="row">

                                        <div className="col-lg-12 ">
                                            <div className="profil-information-left">
                                                <div>Quiz Created </div>
                                                <div> {this.state.quizCount} </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-12">

                                            <div className=" profil-information-right">
                                                <div> Hosted Games </div>
                                                <div> {this.state.quizCount} </div>

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