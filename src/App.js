import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./containers/Home";

const Router = () => {
  return (
    <React.Fragment>
      <div>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default Router;
