import React, { Component } from 'react'

export default class Question extends Component {
    render() {
        return (
            <div>
                <header class="quiz-header">
                    <div class="quiz-logo">
                        <img src="images/logo/logo-w.png" class="img-quiz-logo" alt="" />

                    </div>

                </header>

                <div class="container question-content">

                    <div class="question-image">

                        <img src="images/thumb-1920-943148.jpg" alt="" />

                        <div class="select-box-question">
                            <select name="" id="">
                                <option value="1">20 sec </option>
                                <option value="1">30 sec </option>
                                <option value="1">40 sec </option>
                                <option value="1">50 sec </option>
                            </select>
                        </div>
                    </div>

                    <div class="question-text">

                        <input type="text" class="txt-question" placeholder="Tap to add question" />

                    </div>

                    <div class="question-answer">

                        <div class="row">
                            
                            <div class="col-md-6 ">
                                <div class="d">
                                    <input type="text" class="txt-answer1" placeholder="Answer 1" />
                                    <div class="checkbox">
                                        <input type="radio" name="option" value="1" />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="d2">
                                    <input type="text" class="txt-answer2" placeholder="Answer 2" />
                                    <div class="checkbox">
                                        <input type="radio" name="option" value="1" />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6 ">
                                <div class="d3">
                                    <input type="text" class="txt-answer3" placeholder="Answer 3" />
                                    <div class="checkbox">
                                        <input type="radio" name="option" value="1" />
                                        <label>Option 1</label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="d4">
                                    <input type="text" class="txt-answer4" placeholder="Answer 4" />
                                    <div class="checkbox">
                                        <input type="radio" name="option" value="1" />
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
