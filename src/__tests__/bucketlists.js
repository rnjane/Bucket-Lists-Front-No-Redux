import * as React from 'react';
import { shallow, configure } from 'enzyme';
import { expect } from 'chai';
// import { stub } from 'sinon';
import BucketLists from '../components/BucketLists.jsx';
import Adapter from 'enzyme-adapter-react-15';
configure({ adapter: new Adapter() });


describe('<BucketLists />', () => {
    const wrapper = shallow(<BucketLists />);

    it('renders table displaying all the bucket lists.', () => {
        expect(wrapper.find('Table')).to.have.length(1);
    });
});

describe('<BucketLists />', () => {
    const wrapper = shallow(<BucketLists />);

    it('renders add bucketlist modal', () => {
        expect(wrapper.find('#add-bucket-modal-title')).to.have.length(1);
      });
});

describe('<BucketLists />', () => {
    const wrapper = shallow(<BucketLists />);

    it('renders edit bucketlist modal', () => {
        expect(wrapper.find('#edit-bucket-modal-title')).to.have.length(1);
      });
});

describe('<BucketLists />', () => {
    const wrapper = shallow(<BucketLists />);

    it('renders delete bucketlist modal', () => {
        expect(wrapper.find('#delete-bucket-modal-title')).to.have.length(1);
      });
});