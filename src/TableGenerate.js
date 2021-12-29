import { useEffect, useState } from "react/cjs/react.development";
import {departments, venues as venuesEndpoint} from "./api_endpoints";

function GenerateTable() {
    const [depts, setDepts]= useState([]);
    const [venues, setVenues]= useState([]);

    useEffect(() => {
        fetch(departments)
        .then((response) => response.json())
        .then(resData => {
            setDepts(resData)
        })
        .catch(console.error)

        fetch(venuesEndpoint)
        .then((response) => response.json())
        .then(resData => {
            setVenues(resData)
        })
        .catch(console.error)
    }, [])

    return (
        <div class="header container">
            <h1><i class="far fa-arrow-alt-circle-left"></i>Timetable</h1>
            <div class="rightSide">
                {/* NO IMPL FOR THIS */}
                <div>
                    <label for="Course">Course</label>
                    <select class="form-select form-select-sm" aria-label=".form-select-lg example">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>

                <div>
                    <label for="Course">Departments</label>
                    <select class="form-select form-select-sm" aria-label=".form-select-lg example">
                        {
                            depts.map(dept => <option key={dept.id} value={dept.name}>{dept.name}</option>)
                        }
                        {/* <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option> */}
                    </select>
                </div>

                <div>
                    <label for="Course">LectureRoom</label>
                    <select class="form-select form-select-sm" aria-label=".form-select-lg example">
                        <option value="All">ALL LT</option>
                        {
                            venues.map(venue => <option key={venue.code} value={venue.name}>{venue.name}</option>)
                        }
                        {/* <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option> */}
                    </select>
                </div>

                <button class="lecture btn btn-light">Export</button>
            </div>
        </div>

    );
}

export default GenerateTable;