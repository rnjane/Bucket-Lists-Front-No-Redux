import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Navbar, NavItem, NavDropdown, MenuItem, Nav, Button } from 'react-bootstrap';
import { Table, Modal, Form, FormControl, FormGroup, Pager } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import instance from '../utils';


export default class BucketLists extends Component {
    /**
    Bucket lists class constructor, with initialization of the components state.
    */
    constructor() {
        super();
        this.state = {
            currentBucketId: 0,
            newname: '',
            bucketname: '',
            search: '',
            currentBucketName: '',
            bucketlists: [],
            nextPage: '',
            previousPage: '',
        };
    }

    /**
    fetch all the bucketlists before the component mounts.
    */
    componentWillMount = () => {
        console.log(localStorage.getItem('token'))
        this.getBuckets();
    }

    /**
    method to fetch all the bucket lists from the api.
    */
    getBuckets = () => {
        instance.get('/bucketlists')
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ bucketlists: response.data.Buckets });
                    if (response.data.next_page) {
                        this.setState({ next_page: response.data.next_page });
                    }

                    if (response.data.previous_page) {
                        this.setState({ previous_page: response.data.previous_page });
                    }
                }
            })
            .catch((error) => {
                if (error.response === 'Token is invalid!') {
                    this.setState({'refresh': true})
                    // toast(error.response.data.message);
                }
            });
    }

    /**
    method to search for bucket lists by name.
    */
    searchBucket = (event) => {
        event.preventDefault();
        instance.get(`/bucketlists?q=${this.state.search}`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ bucketlists: response.data.Bucket });
                    toast('Search Results');
                }
            })
            .catch((error) => {
                if (error.response) {
                    toast(error.response.data.message);
                }
            });
    }

    onValueChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    /*
    Method to logout a user.
    */
    logout = () => {
        localStorage.setItem('username', '');
        localStorage.setItem('token', '');
        this.setState({ logout: true })
    }

    /*
    method to go to the next page, when buckets are more than 10(default number of items per page.)
    */
    goNext = () => {
        instance.get(this.state.next_page)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data.Buckets);
                    this.setState({ bucketlists: response.data.Buckets });
                    if (response.data.next_page) {
                        this.setState({ next_page: response.data.next_page });
                    }
                    if (response.data.previous_page) {
                        this.setState({ previous_page: response.data.previous_page });
                    }
                }
            })
            .catch((error) => {
                if (error.response) {
                    toast(error.response.data.message);
                }
            });
    }

    /*
    method to go to the previous page, when it is available.)
    */
    goPrevious = () => {
        instance.get(this.state.previous_page)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ bucketlists: response.data.Buckets });
                    if (response.data.next_page) {
                        this.setState({ next_page: response.data.next_page });
                    }
                    if (response.data.previous_page) {
                        this.setState({ previous_page: response.data.previous_page });
                    }
                }
            })
            .catch((error) => {
                if (error.response) {
                    toast(error.response.data.message);
                }
            });
    }

    /**
    method to add a new bucket list.)
    */
    addBucket = (event) => {
        event.preventDefault();
        if (this.state.bucketname === ''){
            toast('bucket list name can not be empty')
          }else{
        instance.post('/bucketlists',
            { bucketname: this.state.bucketname })
            .then((response) => {
                if (response.status === 201) {
                    this.setState({ addModal: false, addSucces: true, bucketname: '' });
                    toast('Add successful');
                }
            })
            .catch((error) => {
                if (error.response) {
                    toast(error.response.data.message);
                }
            });}
    }

    /**
    method to update a bucket list.
    */
    editBucket = (event) => {
        event.preventDefault();
        instance.put(`/bucketlists/${this.state.currentBucketId}`,
            { newname: this.state.newname },
        )
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ editModal: false, editSucces: true, newname: '' });
                    toast('Edit Succesful');
                }
            })
            .catch((error) => {
                if (error.response) {
                    toast(error.response.data.message);
                }
            });
    }

    /**
    method to delete a bucket list, using the bucketlist's ID.
    */
    deleteBucket = () => {
        instance.delete(`/bucketlists/${this.state.currentBucketId}`,
        )
            .then((response) => {
                if (response.status === 200) {
                    toast('Bucket List Deleted');
                    this.setState({ deleteModal: false, deleteSucces: true });
                }
            })
            .catch((error) => {
                if (error.response) {
                    toast(error.response.data.message);
                }
            });
    }

    /**
    method to render the bucket lists page.
    */
    render() {
        const close = () => this.setState({ addModal: false, editModal: false, deleteModal: false });

        if (this.state.editSucces || this.state.deleteSucces || this.state.addSucces || this.state.addFail) {
            this.getBuckets();
        }

        if (this.state.logout) {
            return (<Redirect to='/login' />);
        }

        if (this.state.viewItems) {
            localStorage.setItem('bucketId', this.state.currentBucketId);
            localStorage.setItem('bucketname', this.state.currentBucketName);
            return (<Redirect to="/items" />);
        }

        return (
            <div>
                <Navbar className="navbar-fixed-top navbar-inverse">
                    <div>
                        <ToastContainer />
                    </div>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="">My Bucket Lists</a>
                        </Navbar.Brand>
                    </Navbar.Header>

                    <Navbar.Form pullRight>
                        <FormGroup>
                            <FormControl type="text" id="search" placeholder="Search Bucketlist" value={this.state.search} required onChange={this.onValueChange} />
                        </FormGroup>
                        {' '}
                        <Button type="submit" onClick={this.searchBucket}>Submit</Button>
                    </Navbar.Form>
                    <Nav className="navbar-right">
                        <NavItem onClick={() => this.setState({ addModal: true, bucketname: '' })}>New Bucket</NavItem>
                        <NavItem href="#">|</NavItem>
                        <NavDropdown title={`welcome ${localStorage.getItem('username')}`} id="basic-nav-dropdown">
                            <MenuItem onClick={this.logout}>Logout</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
                <div className="table-responsive container" width="90%">
                {(this.state.bucketlists[0] != null)?
                    <Table striped bordered>
                        <colgroup>
                            <col span="1" style={{ width: '55%' }} />
                            <col span="1" style={{ width: '15%' }} />
                            <col span="1" style={{ width: '15%' }} />
                            <col span="1" style={{ width: '15%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Bucket Name</th>
                                <th className="text-center">View Items</th>
                                <th className="text-center">Edit Bucket</th>
                                <th className="text-center">Delete Bucket</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.bucketlists.map(bucket =>
                                (<tr>
                                    <td>{bucket.bucket_name}</td>
                                    <td className="text-center"><button type="button" className="btn btn-primary btn-sm" onClick={() => this.setState({ currentBucketId: bucket.bucket_id, viewItems: true, currentBucketName: bucket.bucket_name })}>View Items</button></td>
                                    <td className="text-center"><button type="button" className="btn btn-primary btn-sm" onClick={() => this.setState({ editModal: true, newname: bucket.bucket_name, currentBucketId: bucket.bucket_id })}>Edit</button> </td>
                                    <td className="text-center"><button type="button" className="btn btn-primary btn-sm" onClick={() => this.setState({ deleteModal: true, currentBucket: bucket.bucket_name, currentBucketId: bucket.bucket_id })}>Delete</button></td>
                                </tr>),
                            )}
                        </tbody>   
                    </Table>
                    :<Table striped bordered>
                        <thead>
                            <tr>
                                <th>Bucket Name</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                    <td>No Bucket Lists</td>
                                </tr>
                        </tbody>   
                    </Table>}
                    <Pager>
                        <Pager.Item previous onClick={this.goPrevious}>&larr; Previous Page</Pager.Item>
                        <Pager.Item onClick={this.goNext} next>Next Page &rarr;</Pager.Item>
                    </Pager>
                </div>

                {/* Add a bucket list modal */}
                <div className="modal-container" style={{ height: 200 }}>
                    <Modal
                        show={this.state.addModal}
                        onHide={close}
                        container={this}
                        aria-labelledby="add-bucket-modal-title"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="add-bucket-modal-title">New Bucket-List</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <FormControl type="text" id="bucketname" placeholder="bucketname" value={this.state.bucketname} required onChange={this.onValueChange}  />
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="btn btn-primary" onClick={this.addBucket}>Add Bucket List</Button>
                            <Button onClick={close}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>

                {/* Edit bucketist modal */}
                <div className="modal-container" style={{ height: 200 }}>
                    <Modal
                        show={this.state.editModal}
                        onHide={close}
                        container={this}
                        aria-labelledby="edit-bucket-modal-title"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="edit-bucket-modal-title">Edit Bucket-List</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <FormGroup>
                                    <FormControl type="text" id="newname" placeholder="newname" value={this.state.newname} required onChange={this.onValueChange}  />
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.editBucket} className="btn btn-primary">Edit Bucket List</Button>
                            <Button onClick={close}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>

                {/* Delete bucketlist modal */}
                <div className="modal-container" style={{ height: 200 }}>
                    <Modal
                        show={this.state.deleteModal}
                        onHide={close}
                        container={this}
                        aria-labelledby="delete-bucket-modal-title"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="delete-bucket-modal-title">Delete a Bucket-List</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure to delete "{this.state.currentBucket}"?
            </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.deleteBucket} className="btn btn-primary">Delete Bucket List</Button>
                            <Button onClick={close}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}
