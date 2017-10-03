import * as React from 'react';
import { shallow, configure } from 'enzyme';
import { expect } from 'chai';
// import { stub } from 'sinon';
import BucketItems from '../components/BucketItems.jsx';
import Adapter from 'enzyme-adapter-react-15';
configure({ adapter: new Adapter() });


describe('<BucketItems />', () => {
    const wrapper = shallow(<BucketItems />);

    it('renders bucket activities table', () => {
        expect(wrapper.find('Table')).to.have.length(1);
    });
});

describe('<BucketItems />', () => {
    const wrapper = shallow(<BucketItems />);

    it('renders add bucketlist item modal', () => {
        expect(wrapper.find('#add-bucket-modal-title')).to.have.length(1);
      });
});

describe('<BucketItems />', () => {
    const wrapper = shallow(<BucketItems />);

    it('renders edit bucketlist item modal', () => {
        expect(wrapper.find('#edit-bucket-modal-title')).to.have.length(1);
      });
});

describe('<BucketItems />', () => {
    const wrapper = shallow(<BucketItems />);

    it('renders delete bucketlist item modal', () => {
        expect(wrapper.find('#delete-bucket-modal-title')).to.have.length(1);
      });
});