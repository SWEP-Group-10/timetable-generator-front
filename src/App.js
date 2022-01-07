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

import ProvideAuth from "./auth/provider";
import PrivateRoute from "./auth/protected";

function App() {
  const [showNav, setShowNav] = useState(false);
  return (
    <ProvideAuth>
    <Router>
      {
        showNav ? 
        (
          <div class="header container">
            <h1>Timetable Generator</h1>
            <div class="rightSide">
              <ul>
                <li>
                  <Link to="/home">
                    <button class="home-btn btn btn-success">Home</button>
                  </Link>
                </li>
                <li>
                  <Link to="/lecture-room">
                    <button class="lecture btn btn-light">Lecture Room Info</button>
                  </Link>
                </li>
                <li>
                  <Link to="/generate-timetable">
                    <button class="generate btn btn-primary">Generate Timetable</button>
                  </Link>
                </li>
              </ul>
            </div>
            <hr />
          </div>
        ): ""}

      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Login onSetShowNav={setShowNav}/>
          </Route>
          <PrivateRoute exact path="/home">
            <CourseEntry />
          </PrivateRoute>
          <PrivateRoute path="/lecture-room">
            <LectureRoomEntry />
          </PrivateRoute>
          <PrivateRoute path="/generate-timetable">
            <GenerateTable />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
    </ProvideAuth>
  );
}

export default App;
