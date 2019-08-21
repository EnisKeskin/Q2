import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import Io from '../../connection';

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginVisible: false
        }

    }

    onClickEvent = (e) => {
        if (window.confirm('Are you sure you want to log out')) {
            localStorage.removeItem('token');
            this.setState({ loginVisible: true });
            Io.connectionsRoomDelete();
        }
    }
    render() {
        return (
            <div>
                {this.state.loginVisible ?
                    <Redirect to="/User" />
                    :

                    <header>

                        <div className="logo">
                            <Link to='/profile' >   <img src={require('../../images/logo/logo-v.png')} className="img-logo" alt="" /> </Link>
                        </div>

                        <div className="menu">

                            <ul>
                                <Link to="/">
                                    <li>
                                        <div className="icon"> <img src={require('../../images/menu-icon/enter-pin.png')} className="img-icon" alt="" /> </div>
                                        Enter Pin
                                </li>
                                </Link>
                                <Link to="/Discover">
                                    <li>
                                        <div className="icon"><img src={require('../../images/menu-icon/discover.png')} className="img-icon" alt="" /> </div>
                                        Discover
                                </li>
                                </Link>
                                <Link to="/Quiz">
                                    <li>
                                        <div className="icon"> <img src={require('../../images/menu-icon/create.png')} className="img-icon" alt="" /> </div>
                                        Create
                                </li>
                                </Link>

                                <li className="li-icon"> <Link to="/Profile/Edit"><img src={require('../../images/menu-icon/profil.png')} className="img-icon" alt="" /> </Link> </li>

                                <li> <img src={require('../../images/menu-icon/logout.png')} className="img-icon" alt="" onClick={this.onClickEvent} /> </li>

                            </ul>

                        </div>

                    </header>
                }
            </div>
        )
    }
}

export default Header;