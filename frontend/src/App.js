import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import Home from "./components/Home";
import Groups from "./components/Groups";
import { Route, Router } from "react-router-dom/cjs/react-router-dom.min";
import GroupDetails from "./components/Groups/GroupDetails";
import Events from "./components/Events";
import EventDetails from "./components/Events/EventDetails";
import GroupForm from "./components/Groups/GroupForm";
import EventsForm from "./components/Events/EventsForm";
import GroupUpdateForm from "./components/Groups/GroupUpdateForm";

function App() {

  return (
    <>
    <Header/>
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route exact path='/groups'>
        <Groups />
      </Route>
      <Route exact path='/groups/new'>
        <GroupForm />
      </Route>
      <Route exact path='/groups/:groupId'>
        <GroupDetails/>
      </Route>
      <Route exact path='/events'>
        <Events />
      </Route>
      <Route exact path='/events/:eventId'>
        <EventDetails/>
      </Route>
      <Route exact path = '/groups/:groupId/events/new' >
        <EventsForm/>
      </Route>
      <Route exact path = '/groups/:groupId/edit' >
        <GroupUpdateForm/>
      </Route>
      <Route>
        <h1>404 Error: Not Found!</h1>
      </Route>
    </Switch>
    </>
  );
}

export default App;
