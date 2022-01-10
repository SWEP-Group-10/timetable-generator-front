import { useEffect, useState } from "react/cjs/react.development";
import {venues} from "./api_endpoints";

import {useAuth} from "./auth/provider";
import {MutatingDots} from "react-loader-spinner";

function LectureRoomEntry() {
    const [lectureRoomCode, setLectureRoomCode] = useState("");
    const [lectureRooms, setLectureRooms] = useState([]);
    const [capacity, setCapacity] = useState(0);
    const [addingLT, setAddingLT] = useState(false);
    // BEARER TOKEN
    const {bearerToken} = useAuth();

    function fetchLTs(venues, headers) {
        return fetch(venues, headers)
    }

// auth headers
const authHeaders = {
    'Content-Type': 'apllication/json',
    Authorization: `Bearer ${bearerToken}`
}

    useEffect(() => {
        fetchLTs(venues, {
            headers: {
                'Content-Type': 'apllication/json',
                Authorization: `Bearer ${bearerToken}`
        }})
        .then(res => res.json())
        .then((lts) => {
            console.log(lts)
            setLectureRooms(lts)
        })
        .catch(console.error);
    }, []);

    function handleCourseCodeChange(evt) {
        setLectureRoomCode(evt.target.value)
    }

    function handleCapacityChange(evt) {
        setCapacity(evt.target.value)
    }

    function handleClear() {
        setLectureRoomCode("")
        setCapacity(0)
    }

    function handleAddLT(evt) {
        evt.preventDefault();
        if(!lectureRoomCode || !capacity) return;
        // call the API
        setAddingLT(true);
        console.log("lecture room code", lectureRoomCode)
        console.log("capacity", capacity)
        fetch(venues, {
            method: 'POST',
            headers: {
                ...authHeaders
            },
            body: JSON.stringify({name: lectureRoomCode, size: capacity})
        })
        .then((response) => response.json())
        .then((resData) => {
            prompt(`Lecture Theatre added success`)
            handleClear()
            setAddingLT(false)
            return fetchLTs(venues, {
                headers: {
                    ...authHeaders
            }})
        })
        .then(res => res.json())
        .then((lts) => {
            setAddingLT(false)
            setLectureRooms(lts);
            handleClear()
        })
        .catch((err) => {
            console.error(err);
            setAddingLT(false);
        })
    }

    function handleDeleteCourse() {

    }

    return (
        <div>
            <div class="header container">
                <h1><i class="far fa-arrow-alt-circle-left"></i>Lecture Room Info</h1>
                <div class="rightSide">
                    <button class="generate btn btn-primary">Save Changes</button>
                </div>
            </div>

            <div class="container">
                <div class="courseInfo">
                    <div class="container lt-display">
                        {lectureRooms.length > 0 && (
                            lectureRooms.map(({name, size, code}) => (
                                <div class="row p-2" key={code}>
                                    <div class="col border border-top-0 text-uppercase m-2 p-4">{name}</div>
                                    <div class="col border border-top-0 text-uppercase m-2 p-4">{size}</div>
                                    <div class="d-flex flex-column align-items-end">
                                        <button type="button" class="btn btn-light btn-sm text-danger" onClick={handleDeleteCourse}>delete</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div class="lt-add">
                        <h4>Lecture Room Name</h4>
                        <div class="infoCard">
                            <div class="courseStudents">
                                <div class="ccode border">
                                    <label for="course-code">Lecture Room Code</label>
                                    <input type="text"
                                        class="form-control"
                                        name="courseCode"
                                        id="courseCode"
                                        value={lectureRoomCode}
                                        onChange={handleCourseCodeChange}
                                        placeholder="e.g HSLT C"
                                        list="courses" required />
                                </div>
                                <div class="students border">
                                    <label for="number-of-students">Capacity (Students)</label>
                                    <input type="text"
                                        class="form-control"
                                        name="courseCode"
                                        id="courseCode"
                                        value={capacity}
                                        onChange={handleCapacityChange}
                                        placeholder="e.g 300" required />
                                </div>
                            </div>
                            <div>
                                <button class="btn-del-lect" onClick={handleClear}>Clear</button>
                                {
                                    !addingLT ? (
                                        <button class="btn btn-add-lect" onClick={handleAddLT}>Add LectureRoom</button>
                                    ): (
                                        <MutatingDots arialLabel="loading-indicator"  color="blue" secondaryColor="grey"/>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LectureRoomEntry;