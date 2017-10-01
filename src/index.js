import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Buckets from './components/BucketLists.jsx'
import Items from './components/BucketItems.jsx'


render(
    <Router>
        <div>
            <Route exact path="/" component={ Register } />
            <Route exact path="/register" component={ Register } />
            <Route exact path="/login" component={ Login} />
            <Route exact path="/bucketlists" component={ Buckets } />
            <Route exact path="/items" component={ Items } />
        </div>
    </Router>,
    document.getElementById('root')
);

