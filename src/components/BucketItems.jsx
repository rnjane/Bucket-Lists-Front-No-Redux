import React, { Component } from 'react';
import { Navbar, NavItem, NavDropdown, MenuItem, Nav, Button } from 'react-bootstrap';
import { Table, Modal, Form, FormControl, FormGroup } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import instance from '../utils';
import '../css/mystyles.css';
import { Redirect } from 'react-router-dom';


export default class BucketItems extends Component {
  /**
  bucket lists items class constructor, with component state initialization.
  */
  constructor() {
    super();
    this.state = {
      items: [],
      itemname: '',
      newname: '',
      search: '',
      currentItemId: 0,
      currentbucketname: '',
      gohome: false,
      logout: false,
    };
  }

  /**
  method to check if user is logged in, and redirect accordingly.
  */
  isUserLoggedIn = () => {
    var token = localStorage.getItem('token');
    if (token === '') {
      this.setState({ loginRequired: true });
      return false;
    }
    this.setState({ loginRequired: false });
    return true;

  }

  onValueChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  /**
  check if user is logged in, when component has mounted.
  */
  componentDidMount = () => {
    if (this.isUserLoggedIn()) {
      this.getItems();
    }
  }

  /**
  method to fetch all the items in a bucket list.
  */
  getItems = () => {
    instance.get(`bucketlists/${localStorage.getItem('bucketId')}/items`, {
      headers: {
        token: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        this.setState({ items: response.data.items });
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        }
      });
  }

  /**
  method to add items to a bucket list.
  */
  addItem = (event) => {
    event.preventDefault();
    if (this.state.itemname === ''){
      toast('item name can not be empty')
    }else{
    instance.post(`bucketlists/${localStorage.getItem('bucketId')}/items`,
      { itemname: this.state.itemname },
      { headers: { token: localStorage.getItem('token') } })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ addItem: false, status: true });
          toast('Item added');
        }
        else if (response.status === 205) {
          toast('item name in use. use a different name.');
        }
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        }
      });}
  }

  /**
  method to redirect to bucket lists page from items page.
  */
  goHome = () => {
    this.setState({ gohome: true });
  }

  /**
  method to hedit an item in a bucket list.
  */
  editItem = (event) => {
    event.preventDefault();
    instance.put(`bucketlists/${localStorage.getItem('bucketId')}/items/${this.state.currentItemId}`,
      {
        newname: this.state.newname,
        status: document.getElementById('status').value,
      },
      { headers: { token: localStorage.getItem('token') } })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ editItem: false, status: true });
          toast('Edit succesful');
        }
        else {
          toast(response.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        }
      });
  }

  /**
  method to logout a user.
  */
  logout = () => {
    localStorage.setItem('username', '');
    localStorage.setItem('token', '');
    this.setState({ logout: true })
  }

  /**
  method to delete an item from a bucket list.
  */
  deleteItem = () => {
    instance.delete(`bucketlists/${localStorage.getItem('bucketId')}/items/${this.state.currentItemId}`,
      { headers: { token: localStorage.getItem('token') } })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ deleteItem: false, status: true });
          toast('item deleted');
        }
        else {
          toast(response.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        }
      });
  }

  /**
  method to render the bucket list items page.
  */
  render = () => {
    if (this.state.status) {
      this.getItems();
    }

    if (this.state.logout) {
      return (<Redirect to='/login' />);
    }

    if (this.state.gohome) {
      return (<Redirect to="/bucketlists" />);
    }

    const close = () => this.setState({ addItem: false, editItem: false, deleteItem: false });
    return (
      <div>
        <Navbar className="navbar-fixed-top">
          <div>
            <ToastContainer />
          </div>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="" onClick={this.goHome}>My Bucket Lists</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav className="navbar-right">
            <NavItem onClick={() => this.setState({ addItem: true, itemname: '' })}>New Item</NavItem>
            <NavItem href="#">|</NavItem>
            <NavDropdown title={'welcome ' + localStorage.getItem('username')} id="basic-nav-dropdown">
              <MenuItem>My Profile</MenuItem>
              <MenuItem onClick={this.logout}>Logout</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar>
        <div className="table-responsive container" width="90%">
          <Table striped bordered>
            <colgroup>
              <col span="1" style={{ width: '55%' }} />
              <col span="1" style={{ width: '15%' }} />
              <col span="1" style={{ width: '15%' }} />
              <col span="1" style={{ width: '15%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Item Name</th>
                <th className="text-center">Status</th>
                <th className="text-center">Edit Item</th>
                <th className="text-center">Delete Item</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items.map(item =>
                (<tr className='clickable-row' data-href='google.com'>
                  <td>{item.item_name}</td>
                  <td className="text-center">{item.item_status}</td>
                  <td className="text-center"><button type="button" className="btn btn-primary btn-sm" onClick={() => this.setState({ editItem: true, newname: item.item_name, currentItemId: item.item_id })}>Edit</button> </td>
                  <td className="text-center"><button type="button" className="btn btn-primary btn-sm" onClick={() => this.setState({ deleteItem: true, currentItem: item.item_name, currentItemId: item.item_id })}>Delete</button> </td>
                </tr>),
              )}
            </tbody>
          </Table>
        </div>

        {/* Add item modal */}
        <div className="modal-container" style={{ height: 200 }}>
          <Modal
            show={this.state.addItem}
            onHide={close}
            container={this}
            aria-labelledby="add-bucket-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="add-bucket-modal-title">New Bucket-List Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onClick={this.addItem}>
                <FormGroup>
                  <FormControl type="text" id="itemname" placeholder="itemname" value={this.state.itemname} onChange={this.onValueChange} required/>
                </FormGroup>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.addItem} className="btn btn-primary">Add Item</Button>
              <Button onClick={close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>

        {/* Edit item modal */}
        <div className="modal-container" style={{ height: 200 }}>
          <Modal
            show={this.state.editItem}
            onHide={close}
            container={this}
            aria-labelledby="edit-bucket-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="edit-bucket-modal-title">Edit Bucket-List Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <FormGroup>
                  <FormControl type="text" id="newname" value={this.state.newname} required onChange={this.onValueChange} />
                </FormGroup>
                <FormGroup controlId="formControlsSelect">
                  <FormControl componentClass="select" id="status" placeholder="Status">
                    <option value="Done">Done</option>
                    <option value="Not Done">Not Done</option>
                  </FormControl>
                </FormGroup>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.editItem} className="btn btn-primary">Edit Item</Button>
              <Button onClick={close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>

        {/* Delete item modal */}
        <div className="modal-container" style={{ height: 200 }}>
          <Modal
            show={this.state.deleteItem}
            onHide={close}
            container={this}
            aria-labelledby="delete-bucket-modal-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="add-bucket-modal-title">Delete a Bucket-List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure to delete "{this.state.currentItem}"?
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.deleteItem} className="btn btn-primary">Delete</Button>
              <Button onClick={close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
