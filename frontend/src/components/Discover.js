import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './static/Header';
import { Redirect } from 'react-router';
import Io from '../connection'
import Slider from "react-slick";
import "../javascripts/main";

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
        io = Io.connectionsRoom('profil', localStorage.getItem('token'));
        if (localStorage.getItem('token')) {
            io = Io.connectionsRoom('profil', localStorage.getItem('token'));
            io.on('error', () => {
                this.setState({
                    loginVisible: true
                })
            })
            io.emit('getDiscover');
            io.on('setDiscoverTrend', (quizs) => {
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
    trendShow() {
        const stateQuizs = this.state.trendQuizzes;
        let quizs = [];
        stateQuizs.forEach((element, key) => {
            quizs.push(
                <div className="discover-trend-block" key={key}>
                    <img src={`http://localhost:3000/${element.img}`} alt="" />

                    <div className="discover-block-text">
                        <span className="spn-discover">{element.title} </span>
                        <span className="spn-discover-2"> {element.questionCount} Questions</span>
                        <div className="discover-owner">{element.username} <img src="images/sago.jpg" alt="" /></div>
                    </div>

                </div>
            )
        });
        return quizs;
    }

    quizsShow() {
        const stateQuizs = this.state.myQuiz;
        let quizs = [];
        stateQuizs.forEach((element, key) => {
            quizs.push(
                <div className="discover-quizs-block" key={key}>

                    <img src={`http://localhost:3000/${element.img}`} alt="" />

                    <div className="discover-quizs-text">
                        <span className="spn-discover-quizs">{element.title}</span>
                        <span className="spn-discover-2-quizs"> {element.questionCount}  Questions</span>

                        <div className="discover-owner-quizs">
                            {element.username} <img src={`http://localhost:3000/${element.userImg}`} alt="" />
                        </div>

                    </div>
                </div>
            )
        });
        return quizs;
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
                                    <span className="spn-discover-title">Trending</span>

                                    <span> <Link to="#"> See All </Link></span>
                                </div>

                                <Slider className="discover-trend-bottom" {...settings}>

                                    {this.trendShow()}

                                </Slider>

                            </div>
                        </div>

                        <div className="discover-quizs">
                            <div className="discover-quizs-title">
                                <h3>Quizs</h3>
                            </div>

                            <Slider className="discover-quizs-bottom" {...discoverBottom}>
                                {this.quizsShow()}
                            </Slider>
                        </div>

                    </div>
                }
            </div>
        )
    }
}

export default Discover