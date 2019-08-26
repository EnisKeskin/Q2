import React, { Component } from 'react';
import Io from '../connection';
import { Redirect } from "react-router-dom";
import Ip from "../Ip";
import Superagent from 'superagent';
import { Link } from 'react-router-dom'

let io = null;

class ProfilEdit extends Component {
    constructor(props) {
        super(props);
        this.file = null;
        this.state = {
            username: "",
            email: "",
            firstname: "",
            lastname: "",
            img: "",
            password: null,
            newPassword: null,
            file: null,
            loginVisible: false,
            message: "",
        }
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            io = Io.connectionsRoom('profile', localStorage.getItem('token'));
            io.emit('getProfileEditInfo');
            io.on('setProfileEditInfo', (user) => {
                this.setState({
                    username: user.username,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    img: user.img,
                })
            })

            io.on('error', () => {
                this.setState({
                    loginVisible: true
                })
            });

            io.on('file', (user) => {
                if (this.file) {
                    io.emit('userDeleteImg', user.userId);
                    Superagent
                        .post(`${Ip}api/upload`)
                        .field('userId', user.userId)
                        .field('whereToIns', 'user')
                        .attach("theFile", this.file)
                        .end((err, result) => {
                            if (err)
                                throw err
                        });
                }
            });
            io.on('errors', (msg) => {
                this.setState({
                    message: <div className="login-error sign-err">{msg.message}</div>
                });
            });
            io.on('successfulUpdate', (msg) => {
                this.setState({
                    message: <div className="login-succes sign-err">{msg.message}</div>
                });
            });
        } else {
            this.setState({
                loginVisible: true
            })
        }
    }

    componentWillUnmount() {
        if (localStorage.getItem('token')) {
            io.removeListener('file');
            io.removeListener('successfulUpdate');
            io.removeListener('errors');
            io.removeListener('error');
        }
    }

    onClickEvent = (e) => {
        e.preventDefault();
        const user = this.state
        if (this.state.newPassword) {

            io.emit('profilUpdate', {
                email: user.email,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                password: user.password,
                newPassword: user.newPassword,
            })
        } else {
            io.emit('profilUpdate', {
                email: user.email,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                password: user.password,
            })
        }
    }
    render() {
        let user = this.state;
        return (
            <div>
                {this.state.loginVisible ?
                    <Redirect to='/User' />
                    :
                    <div className="capsule">
                        <div className="figure"></div>
                        <div className="figure-2"></div>
                        <div className="profile-edit-close">
                            <Link to='/Profile'>
                                <img src={require('../images/quiz/cancel.png')} alt="" />
                            </Link>
                        </div>
                        <div className="container p-edit">

                            <div className="col-lg-6 p-edit-capsule">

                                <div className="user-logo p-edit-logo">
                                    <img src={require('../images/logo/logo-w.png')} className="img-user-logo" alt="Quiz" />
                                </div>
                                <div className="signup-text">Profile Edit</div>

                                <div className="p-edit-in">

                                    <form action="." method="POST">
                                        <div className="profil-avatar">
                                            <label className="lbl-file-profil" htmlFor="profil"> Tap to add cover profil images <img src={this.state.file || `${Ip}${user.img}`} alt="" /> </label>
                                            <input className="fileupload-profil" type="file" name="fileToUpload" accept="image/*" id="profil" onChange={(e) => { this.file = e.target.files[0]; this.setState({ file: URL.createObjectURL(e.target.files[0]) }) }} />
                                        </div>
                                        <div className="user-name">

                                            <input type="text" className="txt-username" placeholder="First Name" value={user.firstname || ''} onChange={(e) => { this.setState({ firstname: e.target.value }) }}
                                            />
                                            <input type="text" className="txt-username" placeholder="Last Name" value={user.lastname || ''} onChange={(e) => { this.setState({ lastname: e.target.value }) }} />

                                        </div>
                                        <input type="text" className="txt-signup" autoComplete="username" placeholder="User Name" value={user.username || ''} onChange={(e) => { this.setState({ username: e.target.value }) }} />

                                        <input type="email" className="txt-signup" placeholder="E-Mail" value={user.email || ''} onChange={(e) => { this.setState({ email: e.target.value }) }} />

                                        <input type="password" className="txt-signup" autoComplete="password" placeholder="Password" onChange={(e) => { this.setState({ password: e.target.value }) }} />

                                        <input type="password" className="txt-signup" autoComplete="password" placeholder="New Password" ref='If you want to change the password, fill in the new password field.' onChange={(e) => { this.setState({ newPassword: e.target.value }) }} />

                                        {this.state.message}

                                        <div className="sign-button">
                                            <button type="submit" className="btn-sign save" onClick={this.onClickEvent}>Save</button>
                                        </div>
                                    </form>

                                </div>

                            </div>
                        </div>
                    </div>

                }
            </div>
        )
    }
}

export default ProfilEdit