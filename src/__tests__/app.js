import React from 'react';
import { shallow, configure } from 'enzyme';
import { expect } from 'chai';
import Register from '../components/Register.jsx';
import Login from '../components/Login.jsx';
import BucketLists from '../components/BucketLists.jsx';
import Adapter from 'enzyme-adapter-react-15';
configure({ adapter: new Adapter() });

describe('<Register />', () => {
    const wrapper = shallow(<Register />);

    it('renders registration form', () => {
        expect(wrapper.find('Form')).to.have.length(1);
    });
});

describe('<Login />', () => {
    const wrapper = shallow(<Login />);

    it('renders login form', () => {
        expect(wrapper.find('Form')).to.have.length(1);
    });
});
