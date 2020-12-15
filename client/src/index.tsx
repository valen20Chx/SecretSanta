import React from 'react';
import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Router
import {Router, Route, Switch} from 'react-router';
import {createHashHistory} from 'history';

// Components
import Home from './Components/Home';
import Create from './Components/Create';
import Header from './Components/Header';
import List from './Components/List';
import NotFound from './Components/NotFound';

const history = createHashHistory();

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <Route path="/" component={Header} />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/new" component={Create} />
        <Route exact path="/list/:id" component={List} />
        <Route exact path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
