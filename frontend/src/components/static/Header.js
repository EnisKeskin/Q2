import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'

class Header extends Component {
    constructor(props){
        super(props)
        this.state= {
            loginVisible: false
        }
    }
    render() {
        return (
            <div>
                {this.state.loginVisible?
                <Redirect to="/User" /> 
                :
               
            <header>

                <div className="logo">
                    <img src={require('../../images/logo/logo-v.png')} className="img-logo" alt="" />
                </div>

                <div className="menu">

                    <ul>
                        <li>
                            <div className="icon"> <img src={require('../../images/menu-icon/enter-pin.png')} className="img-icon" alt="" /> </div>
                            <Link to="/"> Enter Pin </Link>
                        </li>
                        <li>
                            <div className="icon"><img src={require('../../images/menu-icon/discover.png')} className="img-icon" alt="" /> </div>
                            <Link to="/Discover"> Discover </Link>
                        </li>
                        <li>
                            <div className="icon"> <img src={require('../../images/menu-icon/create.png')} className="img-icon" alt="" /> </div>
                            <Link to="/Quiz"> Create </Link>
                        </li>

                        <li className="li-icon"> <Link to="/profil"><img src={require('../../images/menu-icon/profil.png')} className="img-icon" alt="" /> </Link> </li>

                        <li> <img src={require('../../images/menu-icon/logout.png')} className="img-icon" alt="" onClick={(e) => {localStorage.removeItem('token'); this.setState({loginVisible: true}) }  } /> </li>

                    </ul>

                </div>

            </header>
        }
        </div>
       )
    }
}

export default Header;