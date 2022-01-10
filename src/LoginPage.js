import { useState } from "react/cjs/react.development";

import {auth as authEndpoint} from "./api_endpoints";

import {
    useHistory,
    useLocation
} from "react-router-dom";

import {useAuth} from "./auth/provider";

import {MutatingDots} from "react-loader-spinner"


function Login({onSetShowNav}) {
    const [userData, setUserData] = useState({});
    const [loginLoading, setLoginLoading] = useState(false);
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();


    function handleUserDataChange(evt) {
        const {name, value} = evt.target;
        setUserData({...userData, [name]: value});
        console.log(userData)
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        setLoginLoading(true);
        console.log("submitting", userData)
        let { from } = location.state || { from: { pathname: "/home" } };
        // POSt request to login
        fetch(authEndpoint, {
            method: 'POST', 
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }).then(response => {
            return response.json()
        })
        .then(({bearer_token}) => {
            // window.sessionStorage.setItem("bearer_token", bearer_token)
            console.log("login success", bearer_token)
            auth.setBearerToken(bearer_token);
            history.replace(from);
            onSetShowNav(true)
            setLoginLoading(false);
        })
        .catch((err) => {
            auth.setBearerToken("")
            console.error(err);
            setLoginLoading(false)
        })
    }

    return (
        <div class="container">

        <div class="row vh-100 d-flex justify-content-center align-items-center mt-5">
          <div class="col-5">
            <h3 class="text-center">Sign in to your account</h3>
            <p class="text-muted h6 text-center mb-5"> Enter your email address and password</p>
  
            <form action="#" onSubmit={handleSubmit}>
              <div class="col-12 mx-auto d-flex flex-column justify-content-start mt-1 border border-1 p-2">
                <label class="text-muted" for="email">Username</label>
                <input type="text" class="form-control border" name="username" id="courseCode" placeholder="eyitopelawal@oauife.edu.ng" onChange={handleUserDataChange} required />
              </div>
  
              <div class="col-12 mx-auto d-flex flex-column justify-content-start mt-4 border border-1 p-2">
                <label class="text-muted" for="password">Password</label>
                <input type="password" class="form-control border" name="password" placeholder="Password" onChange={handleUserDataChange} required />
              </div>
              <label class="text-muted fs-6 ms-3" for="">password should be atleast 6 characters</label>
              <div class="mutating-login">
                {
                  !loginLoading? (
                    <button class="btn btn-primary col-12 mt-5" type="submit">Sign In</button>
                  ): (
                    <div class="mutating-dots">
                      <MutatingDots arialLabel="loading-indicator" width={100}  color="blue" secondaryColor="grey"/>
                    </div>
                  )
                }
              </div>
            </form>
  
          </div>
        </div>
      </div>
    );
}

export default Login;