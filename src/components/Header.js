import React from 'react'
import "bootswatch/dist/minty/bootstrap.min.css";
import './Header.css';
import { Authenticator } from '@aws-amplify/ui-react';
// import "bootswatch/dist/simplex/bootstrap.min.css";
// import config from './aws-exports'
// import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';
// import './App.css';
import { Route, Link } from "react-router-dom";

const Header = () => {
    return (
        <header>
            <Authenticator>
                {({ signOut, user }) => (
                    <div>
                        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                            <div className="container-fluid">
                                <a className="navbar-brand">Trackle</a>

                                <div className="navbar-collapse" id="navbarColor01">
                                <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <a className="nav-link">History</a>
                                    </li>
                                    <li className="nav-item">
                                    <a className="nav-link">Rankings</a>
                                    </li>
                                    <li className="nav-item">
                                    <a className="nav-link">Club</a>
                                    </li>
                                    <li className="nav-item">
                                    <a className="nav-link">Home</a>
                                    </li>
                                </ul>
                                <button className="signoutbutton btn btn-secondary my-2 my-sm-0" type="submit"id='signout' onClick={signOut}>Sign out</button>
                                </div>
                            </div>
                        </nav>
                    </div>
                )}
            </Authenticator>
        </header>
    )
}

export default Header