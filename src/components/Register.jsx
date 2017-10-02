import React, { Component } from 'react';
import '../css/bootstrap/css/bootstrap.css';
import { Row, Form, FormControl, FormGroup, Panel, Col } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import instance from '../utils'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default class Register extends Component {
	/**
    Register class constructor, with the component state initialization..
    */
	constructor(props) {
		super(props);
		this.state = {
			registerSucces: false,
			username: '',
			first_name: '',
			last_name: '',
			email: '',
			password: '',
		}
		this.register = this.register.bind(this);
	}
	
	/**
    Registration method using values from state.
    */
	register = (event) => {
		event.preventDefault()
		instance.post('auth/register', {
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			username: this.state.username,
			password: this.state.password,
		}).then(response => {
			if (response.status === 201) {
				this.setState({ registerSucces: true });
			}
			else {
				toast(response.data.message);
			}
		})
			.catch(function (error) {
				toast(error.response.data.message);
			});
	}

	onValueChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }
	
	/**
    method to render the registration page.
    */
	render() {
		const { registerSucces } = this.state

		if (registerSucces) {
			return <Redirect to='/login' />
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
						Register
							<hr />
						<Row>
							<Col className="col-lg-12">
								<Form onSubmit={this.register}>
									<FormGroup>
										<FormControl type="text" id="first_name" placeholder="First Name"  value={this.state.first_name} required onChange={this.onValueChange} />
									</FormGroup>
									<FormGroup>
										<FormControl type="text" id="last_name" placeholder="Last Name"  value={this.state.last_name} required onChange={this.onValueChange}  />
									</FormGroup>
									<FormGroup>
										<FormControl type="text" id="user_name" placeholder="username"  value={this.state.username} required onChange={this.onValueChange}  />
									</FormGroup>
									<FormGroup>
										<FormControl type="text" id="email" placeholder="Email"  value={this.state.email} required onChange={this.onValueChange}  />
									</FormGroup>
									<FormGroup>
										<FormControl type="password" id="password" placeholder="password" value={this.state.password} required onChange={this.onValueChange} ired />
									</FormGroup>
									<FormGroup>
										<FormControl type="password" id="confirm-password" placeholder="confirm password" required />
									</FormGroup>
									<FormGroup>
										<FormControl type="submit" value="Register" className="btn btn-primary" />
									</FormGroup>
									<FormGroup className="text-center">
										<Link to="/login" className="text-center"> Already Registered? Login</Link>
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
