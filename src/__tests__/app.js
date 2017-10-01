import React from 'react';
import { shallow, configure } from 'enzyme';
import { expect } from 'chai';
import Register from '../components/Register.jsx';
import Login from '../components/Login.jsx';
import BucketItems from '../components/BucketItems.jsx';
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

describe('<BucketLists />', () => {
    const wrapper = shallow(<BucketLists />);

    it('renders table displaying all the bucket lists.', () => {
        expect(wrapper.find('Table')).to.have.length(1);
    });
});

describe('<BucketLists />', () => {
    const wrapper = shallow(<BucketLists />);

    it('renders all the modals in the bucket lists page.', () => {
        expect(wrapper.find('Modal')).to.have.length(3);
    });
});

describe('<BucketItems />', () => {
    const wrapper = shallow(<BucketItems />);

    it('renders bucket activities table', () => {
        expect(wrapper.find('Table')).to.have.length(1);
    });
});

describe('<BucketItems />', () => {
    const wrapper = shallow(<BucketItems />);

    it('renders all the modals in the activities component', () => {
        expect(wrapper.find('Modal')).to.have.length(3);
    });
});
