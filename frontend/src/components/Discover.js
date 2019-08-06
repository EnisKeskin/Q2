import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './static/Header';
import Io from '../connection'

let io = null;

class Discover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quizs: [],
        }
    }

    componentDidMount() {
        io = Io('profil', localStorage.getItem('token'));
        io.emit('getDiscover');
        io.on('setDiscover', (quizs) => {
            this.setState({
                quizs: quizs
            })
        })
    }

    trendShow() {
        const stateQuizs = this.state.quizs;
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
        const stateQuizs = this.state.quizs;
        let quizs = [];
        stateQuizs.forEach((element, key) => {
            quizs.push(
                <div className="discover-quizs-block" key={key}>

                <img src={`http://localhost:3000/${element.img}`} alt="" />

                <div className="discover-quizs-text">
                    <span className="spn-discover-quizs">{element.title}</span>
                    <span className="spn-discover-2-quizs"> {element.questionCount}  Questions</span>

                    <div className="discover-owner-quizs">
                    {element.username} <img src="images/sago.jpg" alt="" />
                    </div>

                </div>
            </div>
            )
        });
        return quizs;
    }

    render() {
        return (
            
            <div className="capsule-2">

                <Header />
                <div className="discover-menu">

                    <ul>
                        <li><Link className="active" to="#"> History </Link></li>
                        <li><Link to="#"> Match </Link></li>
                        <li><Link to="#"> Science </Link></li>
                        <li><Link to="#"> Art </Link></li>
                        <li><Link to="#"> Literature </Link></li>
                        <li><Link to="#"> Trivia </Link></li>

                    </ul>

                </div>

                <div className="discover-trend">
                    <div className="discover-trend-in">
                        <div className="discover-title">
                            <span className="spn-discover-title">Trending</span>

                            <span> <Link to="#"> See All </Link></span>
                        </div>

                        <div className="discover-trend-bottom">

                            {this.trendShow()}

                        </div>
                    </div>
                </div>

                <div className="discover-quizs">
                    <div className="discover-quizs-title">
                        <h3>Quizs</h3>
                    </div>

                    <div className="discover-quizs-bottom">
                        {this.quizsShow()}
                    </div>
                </div>

            </div>

        )
    }
}

export default Discover