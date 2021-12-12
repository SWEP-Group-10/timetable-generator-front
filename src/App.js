import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";

import CourseEntry from './CourseEntry';
import LectureRoomEntry from "./LectureRoomEntry";
import GenerateTable from "./TableGenerate";
import Login from "./LoginPage";

function App() {
  return (
    <Router>

      <div class="header container">
        <h1>Timetable Generator</h1>
        <div class="rightSide">
          <ul>
            <li>
              <Link to="/">
                <button class="home-btn btn btn-success">Home</button>
              </Link>
            </li>
            <li>
              <Link to="lecture-room">
                <button class="lecture btn btn-light">Lecture Room Info</button>
              </Link>
            </li>
            <li>
              <Link to="generate-timetable">
                <button class="generate btn btn-primary">Generate Timetable</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <div className="App">
        <Switch>
          <Route exact path="/">
            <CourseEntry />
          </Route>
          <Route path="/lecture-room">
            <LectureRoomEntry />
          </Route>
          <Route path="/generate-timetable">
            <GenerateTable />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
