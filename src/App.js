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
          <div class="header container align-items-center">
            <h2 class="col-4 my-4 justify-self-center mr">Timetable Generator</h2>
            <div class="rightSide">
              <ul>
                <li>
                  <Link to="/home">
                    <button class="btn btn-success border border-grey mx-2 my-3 px-4 py-3"><strong>Home</strong></button>
                  </Link>
                </li>
                <li>
                  <Link to="/lecture-room">
                    <button class="btn btn-transparent border border-grey mx-2 my-3 px-5 py-3"><strong>Lecture Room Info</strong></button>

                  </Link>
                </li>
                <li>
                  <Link to="/generate-timetable">
                    <button class="h2 btn btn-primary border border-grey mx-2 my-3 px-5 py-3"><strong>Generate Timetable</strong></button>
                  </Link>
                </li>
              </ul>
            </div>
            <hr />
            <div class="border-bottom"></div>
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
