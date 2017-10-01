import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Form, FormControl, FormGroup, Panel, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import instance from '../utils';

export default class Login extends Component {
    /**
    Login class constructor, with the login component state initialization
    */
    constructor(props) {
        super(props);
        this.state = {
            loginSucces: false,
        }
    }

    /**
    Login method, 
    */
    login = (event) => {
        event.preventDefault()
        instance.post('auth/login', {
            username: this.state.username,
            password: this.state.password,
        }).then(response => {
            if (response.status === 202) {
                localStorage.setItem('username', '');
                localStorage.setItem('token', '');
                localStorage.setItem('username', response.data['username']);
                localStorage.setItem('token', response.data['token']);
                this.setState({ loginSucces: true });
            }
            else {
                toast(response.data.message)
            }
        })
            .catch(function (error) {
                if (error.response) {
                    toast(error.response.data.message);
                }
            });
    }

    /**
    method to handle password change.
    */
    onPasswordChange = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    /**
    method to handle user name change.
    */
    onUsernameChange = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    /**
    render the login page
    */
    render() {
        const { loginSucces } = this.state

        /**
        Redirect to buckets page when login is succesful.
        */
        if (loginSucces && localStorage.getItem('token') !== '') {
            return (<Redirect to="/bucketlists" />)
        }

        return (
            <Row>
                <ToastContainer
                    position="top-right"
                    type="default"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover
                />
                <div className="col-md-6 col-md-offset-3">
                    <Panel>
                        Login
                        <hr />
                        <Row>
                            <Col className="col-lg-12">
                                <Form onSubmit={this.login}>
                                    <FormGroup>
                                        <FormControl type="text" id="username" placeholder="username" value={this.state.username} required onChange={this.onUsernameChange} />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormControl type="password" id="password" placeholder="password" value={this.state.password} required onChange={this.onPasswordChange} />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormControl type="submit" value="Login" className="btn btn-primary" />
                                    </FormGroup>
                                    <FormGroup className="text-center">
                                        <Link to="/register" className="text-center"> No Account? Register</Link>
                                    </FormGroup>
                                </Form>
                            </Col>
                        </Row>
                    </Panel>
                </div>
            </Row>
        );
    }
}