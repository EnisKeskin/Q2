import React, { Component } from 'react'
// import io from '../connection';
// import { Redirect } from 'react-router'
import userControl from '../middleware/userControl'

class Quiz extends Component {

    // constructor(props) {
    //     super(props);

    // }

    componentDidMount() {
        console.log(userControl);
    }
    

    render() {
        return (
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
                                <select name="" id="">
                                    <option value="1">Visible to </option>
                                    <option value="1">option 2</option>
                                    <option value="1">option 3</option>
                                    <option value="1">option 4</option>
                                </select>
                            </div>

                            <div className="select-box select-box-2">
                                <select name="" id="">
                                    <option value="1">Location </option>
                                    <option value="1">option 2</option>
                                    <option value="1">option 3</option>
                                    <option value="1">option 4</option>
                                </select>
                            </div>

                            <div className="select-box select-box-3">
                                <select name="" id="">
                                    <option value="1">Language </option>
                                    <option value="1">option 2</option>
                                    <option value="1">option 3</option>
                                    <option value="1">option 4</option>
                                </select>
                            </div>
                            
                        </div>
                        <input type="text" placeholder="Title" className="txt-title" />
                        <textarea placeholder="Description" className="txt-description"></textarea>
                    </div>
                </div>

                <div className="quiz-enter-button">
                    <button type="button" className="btn-quiz-enter">Enter</button>
                </div>
            </div>
        )
    }
}

export default Quiz;