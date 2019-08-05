import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class header extends Component {
    render() {
        return (
            <header>

                <div className="logo">
                    <img src={require('../../images/logo/logo-v.png')} className="img-logo" alt="" />
                </div>

                <div className="menu">

                    <ul>
                        <li>
                            <div className="icon"> <img src={require('../../images/menu-icon/enter-pin.png')} className="img-icon" alt="" /> </div>
                            <Link to="#"> Enter Pin </Link>
                        </li>
                        <li>
                            <div className="icon"><img src={require('../../images/menu-icon/discover.png')} className="img-icon" alt="" /> </div>
                            <Link to="#"> Discover </Link>
                        </li>
                        <li>
                            <div className="icon"> <img src={require('../../images/menu-icon/create.png')} className="img-icon" alt="" /> </div>
                            <Link to="/quiz"> Create </Link>
                        </li>

                        <li className="li-icon"> <Link to="/profil"><img src={require('../../images/menu-icon/profil.png')} className="img-icon" alt="" /> </Link> </li>

                        <li> <img src={require('../../images/menu-icon/settings.png')} className="img-icon" alt="" /> </li>

                    </ul>

                </div>

            </header>
        )
    }
}
