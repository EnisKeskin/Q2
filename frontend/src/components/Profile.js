import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import Io from '../connection';

let io = null;

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profilImg: "",
            username: "",
            fullname: "",
            quizs: [],
            loginVisible: false,
        }
    }

    componentDidMount() {
        io = Io('profil', localStorage.getItem('token'));
        io.emit('getProfilInfo');
        io.on('setProfilInfo', (user) => {
            this.setState({
                username: user.username,
                fullname: user.firstname + " " + user.lastname
            });
        });
        io.on('profilQuiz', (quizs) => {
            this.setState({
                quizs
            });
        });
    }

    quizModel() {
        const stateQuizs = this.state.quizs;
        const quizs = [];
        stateQuizs.forEach((quiz, key) => {
            quizs.push(
                <div key={key}>
                    <div data-toggle="modal" data-target={"#quiz-item-modal"+key} className="my-quiz">
                        <div className="my-quiz-img">
                            <img src={require('../images/quiz/quiz.png')} className="img-quiz" alt="" />
                        </div>

                        <div className="my-quiz-name">
                            {quiz.title}
                        </div>

                    </div>

                    <div className="modal fade bd-example-modal-lg" id={"quiz-item-modal"+key} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel"
                        aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">

                            <div className="modal-content">


                                <div className="container-fluid">
                                    <div className="row">

                                        <div className="col-lg-6 modal-left">
                                            <img src={require('../images/thumb-1920-943148.jpg')} className="img-modal" alt="" />
                                        </div>

                                        <div className="col-lg-6 modal-right">

                                            <h4 className="h4 modal-h4">{quiz.title}</h4>

                                            <div className="modal-user">

                                                <img src={require('../images/user/Oval.png')} className="img-user-modal" alt="" />

                                                <div className="modal-name">sytopcu</div>

                                                <div className="modal-star">

                                                    <img src={require('../images/quiz/star.png')} alt="" className="img-star" />

                                                    <img src={require('../images/quiz/dot.png')} className="img-dot" alt="" />
                                                </div>

                                            </div>

                                            <h5 className="h5-subtitle">Description</h5>

                                            <p> {quiz.description} </p>

                                            <button type="button" className="btn-play">Play</button>
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
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
                        <Link to="#" className="mobil-profil">Profil</Link>

                        <header>

                            <div className="logo">
                                <img src={require('../images/logo/logo-v.png')} className="img-logo" alt="" />
                            </div>

                            <div className="menu">

                                <ul>
                                    <li>
                                        <div className="icon"> <img src={require('../images/menu-icon/enter-pin.png')} className="img-icon" alt="" /> </div>
                                        <Link to="#"> Enter Pin </Link>
                                    </li>
                                    <li>
                                        <div className="icon"><img src={require('../images/menu-icon/discover.png')} className="img-icon" alt="" /> </div>
                                        <Link to="#"> Discover </Link>
                                    </li>
                                    <li>
                                        <div className="icon"> <img src={require('../images/menu-icon/create.png')} className="img-icon" alt="" /> </div>
                                        <Link to="/quiz"> Create </Link>
                                    </li>

                                    <li className="li-icon"> <Link to="/profil"><img src={require('../images/menu-icon/profil.png')} className="img-icon" alt="" /> </Link> </li>

                                    <li> <img src={require('../images/menu-icon/settings.png')} className="img-icon" alt="" /> </li>

                                </ul>

                            </div>

                        </header>

                        <div className="content">

                            <div className="content-profil" id="profil">

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

                                        <div className="col-lg-6">
                                            <div className="profil-information-left">
                                                <div>Quiz Created </div>
                                                <div> 1 </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6">

                                            <div className=" profil-information-right">
                                                <div> Hosted Games </div>
                                                <div> 1 </div>

                                            </div>
                                        </div>

                                        <div className="col-lg-12">
                                            <div className="profil-capsule">
                                                <div>Challenges Played </div>
                                                <div>1</div>
                                            </div>
                                        </div>

                                        <div className="col-lg-12">
                                            <div className="profil-capsule">
                                                <div>Live Games Played </div>
                                                <div>1</div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="content-right">
                                <div className="content-menu">
                                    <ul>
                                        <li><Link className="active" to="#">My Quiz</Link></li>
                                        <li><Link to="#">Favorite</Link></li>
                                        <li><Link to="#">Latest</Link></li>
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