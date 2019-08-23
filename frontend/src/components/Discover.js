import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './static/Header';
import { Redirect } from 'react-router';
import Io from '../connection'
import Slider from "react-slick";
import "../javascripts/main";
import Ip from '../Ip';

let io = null;

class Discover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            trendQuizzes: [],
            myQuiz: [],
            loginVisible: false,
        }
    }


    componentDidMount() {
        if (localStorage.getItem('token')) {
            io = Io.connectionsRoom('profile', localStorage.getItem('token'));
            io.on('error', () => {
                this.setState({
                    loginVisible: true
                })
            })
            io.emit('getDiscover');
            //isim değişikliği
            io.on('setDiscover', (quizs) => {
                this.setState({
                    trendQuizzes: quizs
                })
            })
            io.on('setDiscoverMyQuiz', (quizs) => {
                this.setState({
                    myQuiz: quizs
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
            io.removeListener('setDiscoverTrend');
            io.removeListener('setDiscoverMyQuiz');
        }
    }
    discoverShow() {
        const stateQuizs = this.state.trendQuizzes;
        let quizs = [];
        stateQuizs.forEach((quiz, key) => {
            quizs.push(
                <div data-toggle="modal" data-target={"#quiz-item-modal" + key} className="discover-trend-block" key={key}>
                    <img src={quiz.img !== '' ? `${Ip}${quiz.img}` : require('../images/quiz/defaultQuiz.png')} alt="" />
                    <div className="discover-block-text">
                        <span className="spn-discover">{quiz.title.length < 20 ? quiz.title : quiz.title.slice(0, 20) + '...'} </span>
                        <span className="spn-discover-2"> {quiz.questionCount} Questions</span>
                        <div className="discover-owner">{quiz.username} <img src={typeof (quiz.userImg) !== 'undefined' ? `${Ip}${quiz.userImg}` : require('../images/quiz/avatar2.png')} alt="" /></div>
                    </div>
                </div>
            )
        });
        return quizs;
    }

    discoverModalShow() {
        const stateQuizs = this.state.trendQuizzes;
        let quizs = [];
        stateQuizs.forEach((quiz, key) => {
            console.log(quiz);
            quizs.push(
                <div className="modal fade bd-example-modal-lg" id={"quiz-item-modal" + key} key={key} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">

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

                                            <img src={typeof (quiz.userImg) !== 'undefined' ? `${Ip}${quiz.userImg}` : require('../images/quiz/avatar2.png')} className="img-user-modal" alt="" />

                                            <div className="modal-name">{quiz.username}</div>

                                        </div>

                                        <h5 className="h5-subtitle">Description</h5>

                                        <p> {quiz.description} </p>
                                        <div className="modal-start">
                                            <Link to={{ pathname: '/Players', state: { pin: quiz.pin, visible: true } }} className="btn-play">Play</Link>
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

    quizsShow() {
        const stateQuizs = this.state.myQuiz;
        let quizs = [];
        stateQuizs.forEach((quiz, key) => {
            quizs.push(
                <div data-toggle="modal" data-target={"#my-quiz-item-modal" + key} className="discover-quizs-block" key={key}>
                    <img src={quiz.img !== '' ? `${Ip}${quiz.img}` : require('../images/quiz/defaultQuiz.png')} alt="" />

                    <div className="discover-quizs-text">
                        <span className="spn-discover-quizs">{quiz.title.length < 20 ? quiz.title : quiz.title.slice(0, 20) + '...'}</span>
                        <span className="spn-discover-2-quizs"> {quiz.questionCount}  Questions</span>

                        <div className="discover-owner-quizs">
                            {quiz.username} <img src={typeof (quiz.userImg) !== 'undefined' ? `${Ip}${quiz.userImg}` : require('../images/quiz/avatar2.png')} alt="" />
                        </div>

                    </div>
                </div>

            )
        });
        return quizs;
    }

    quizsModalShow() {
        const stateQuizs = this.state.myQuiz;
        let quizs = [];
        stateQuizs.forEach((quiz, key) => {
            quizs.push(
                <div className="modal fade bd-example-modal-lg" id={"my-quiz-item-modal" + key} key={key} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">

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

                                            <img src={typeof (quiz.userImg) !== 'undefined' ? `${Ip}${quiz.userImg}` : require('../images/quiz/avatar2.png')} className="img-user-modal" alt="" />

                                            <div className="modal-name">{quiz.username}</div>

                                            <div className="modal-star">
                                                <Link to={{ pathname: '/Quiz/Edit', state: { quizId: quiz._id } }}>
                                                    <img src={require('../images/quiz/refresh.png')} alt="" className="img-delete" />
                                                </Link>
                                                <img src={require('../images/quiz/delete.png')} className="img-delete" alt="" data-dismiss="modal" onClick={this.onClickEvent.bind(this, quiz._id)} />
                                            </div>

                                        </div>

                                        <h5 className="h5-subtitle">Description</h5>

                                        <p> {quiz.description} </p>
                                        <div className="modal-start">
                                            <Link to={{ pathname: '/Players', state: { pin: quiz.pin, visible: true } }} className="btn-play">Play</Link>
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

    onClickEvent = (quizId, e) => {
        const confirm = window.confirm('Are you sure you want to delete');
        if (confirm) {
            io.emit('quizDel', quizId);
            io.emit('getDiscover');
        }
    }
    render() {
        const settings = {
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 5,
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
        return (
            <div>
                {this.state.loginVisible ?
                    <Redirect to='/user' />
                    :
                    <div className="capsule-2">

                        <Header />
                        <div className="discover-menu">

                            <ul>
                                <li><Link className="active" to="#"> History </Link></li>

                            </ul>

                        </div>

                        <div className="discover-trend">
                            <div className="discover-trend-in">
                                <div className="discover-title">
                                    <span className="spn-discover-title">Discover</span>
                                </div>

                                <Slider className="discover-trend-bottom" {...settings}>

                                    {this.discoverShow()}

                                </Slider>

                                {this.discoverModalShow()}

                            </div>
                        </div>

                        <div className="discover-quizs">
                            <div className="discover-quizs-title">
                                <h3>Quizs</h3>
                            </div>

                            <Slider className="discover-quizs-bottom" {...discoverBottom}>
                                {this.quizsShow()}
                            </Slider>
                            {this.quizsModalShow()}
                        </div>



                    </div>
                }
            </div>
        )
    }
}

export default Discover