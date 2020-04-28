import React from 'react';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Home from '../Home';
import PageReplacementAlgorithm from '../PageReplacementAlgorithm';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path ='/' component={Home}></Route>
        <Route path ='/page-replacement-algorithm' component={PageReplacementAlgorithm}></Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
