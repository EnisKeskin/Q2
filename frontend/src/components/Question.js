import React, { Component } from 'react'

class Question extends Component {

    constructor(props) {
        super(props);
        this.state

    }

    render() {
        return (
            <div class="capsule-2">

                <header class="quiz-header">
                    <div class="quiz-logo">
                        <img src={require('../images/logo/logo-w.png')} class="img-quiz-logo" alt="" />

                    </div>

                    {/* <div class="close">
                        <img src={require('../images/quiz/cancel.png')} alt="" />
                    </div> */}

                </header>

                <div class="container question-content">

                    <div class="question-image">

                        <img src={require('../images/thumb-1920-943148.jpg')} alt="" />

                        <div class="select-box-question">
                            <select name="" id="">
                                <option value="10">10 sec </option>
                                <option value="20">20 sec </option>
                                <option value="30">30 sec </option>
                                <option value="40">40 sec </option>
                                <option value="50">50 sec </option>
                                <option value="60">60 sec </option>

                            </select>
                        </div>

                    </div>
                    <div class="question-text">

                        <input type="text" class="txt-question" placeholder="Tap to add question" onChange={this.onChangeQuestionEvent} />

                    </div>

                    <div class="question-answer">

                        <div class="row">

                            <div class="col-md-6 ">
                                <div class="a1">
                                    <input type="text" class="txt-answer1" placeholder="Answer 1" onChange={this.onChangeAnswer1Event} />
                                    <div class="checkbox">
                                        <input type="radio" name="option" value="1" />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="a2">
                                    <input type="text" class="txt-answer2" placeholder="Answer 2" onChange={this.onChangeAnswer2Event}/>
                                    <div class="checkbox">
                                        <input type="radio" name="option" value="2" />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6 ">
                                <div class="a3">
                                    <input type="text" class="txt-answer3" placeholder="Answer 3" onChange={this.onChangeAnswer3Event}/>
                                    <div class="checkbox">
                                        <input type="radio" name="option" value="3" />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="a4">
                                    <input type="text" class="txt-answer4" placeholder="Answer 4" onChange={this.onChangeAnswer4Event}/>
                                    <div class="checkbox">
                                        <input type="radio" name="option" value="4" onChange={this.onChangeTrueAnswerEvent} />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="add-question">

                        <img src="images/quiz/add.png" class="img-add" alt="" />

                    </div>
                </div>
            </div>
        )
    }
}
export default Question