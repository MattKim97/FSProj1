import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import Home from "./components/Home";
import Groups from "./components/Groups";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import GroupDetails from "./components/Groups/GroupDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    <div style={{display:'flex', justifyContent:'space-between', backgroundColor:'whitesmoke', borderBottom:'grey solid'}}>
      <Header/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
    </div>
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route exact path='/groups'>
        <Groups />
      </Route>
      <Route exact path='/groups/:groupId'>
        <GroupDetails/>
      </Route>
    </Switch>
    </>
  );
}

export default App;
