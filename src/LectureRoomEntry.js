import { useState } from "react/cjs/react.development";
import {venues} from "./api_endpoints";

function LectureRoomEntry() {
    const [lectureRoomCode, setLectureRoomCode] = useState("");
    const [capacity, setCapacity] = useState(0);

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
        console.log("lecture room code", lectureRoomCode)
        console.log("capacity", capacity)
        fetch(venues, {
            method: 'POST',
            headers: {
                'Content-Type': 'apllication/json'
            },
            body: JSON.stringify({name: lectureRoomCode, size: capacity})
        })
        .then((response) => response.json())
        .then((resData) => {
            prompt(`Lecture Theatre added success`)
            handleClear()
        })
        .catch(console.error)
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
                            {/* <datalist id="courses">
                                <option value="HSLT C">HSLT C</option>
                                <option value="BOO A">BOO A</option>
                                <option value="1K LT">1K LT</option>
                                <option value="FB LT">FB LT</option>
                                <option value="AMPHI">AMPHI</option>
                            </datalist> */}
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
                            <button class="btn-del-lect" onClick={handleClear}>Delete</button>
                            <button class="btn btn-add-lect" onClick={handleAddLT}>Add LectureRoom</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LectureRoomEntry;