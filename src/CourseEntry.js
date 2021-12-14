import { useState, useEffect, useRef } from "react";

import { departments as deptEndpoint } from "./api_endpoints";

const deptEndpointLocal = "http://localhost:3003/departments"

function CourseEntry() {
    const [courseCode, setCourseCode] = useState("");
    const [numStudents, setNumStudents] = useState(0);
    const [depts, setDepts] = useState([]);
    const [deptCode, setDeptCode] = useState([]);
    const [daysSelected, setDaysSelected] = useState(['']);


    const divSelect = useRef();

    useEffect(() => {
        fetch(deptEndpointLocal)
            .then(resp => resp.json())
            .then(data => {
                console.log(data)
                setDepts(data)
            })
    }, []);

    function handleCourseCodeChange(evt) {
        // console.log(evt.target.value)
        setCourseCode(evt.target.value);
    }

    function handleNumStudentsChange(evt) {
        // console.log(Number(evt.target.value))
        setNumStudents(Number(evt.target.value))
    }

    function handleDeptEntryCancel(evt, code) {
        const newDeptCode = deptCode.filter(dc => dc != code)
        setDeptCode(newDeptCode)
        evt.target.parentNode.remove()
    }

    function handleDepartmentSelect(evt) {
        const code = evt.target.value;
        evt.target.value = ''
        if (deptCode.includes(code)) return;
        console.log(code)
        // add button to div
        const deptBtn = document.createElement("button")
        deptBtn.setAttribute("class", "dept-entry")
        const btnText = document.createTextNode(code);
        const cancelSpan = document.createElement("span");
        cancelSpan.setAttribute("class", "dept-entry-cancel");
        cancelSpan.addEventListener("click", (evt, code) => handleDeptEntryCancel(evt, code))
        const cancelText = document.createTextNode("X")
        cancelSpan.appendChild(cancelText);
        deptBtn.appendChild(btnText)
        deptBtn.append(cancelSpan);
        divSelect.current.appendChild(deptBtn)
        setDeptCode([...deptCode, code]);
    }

    function handleDaysClick(evt) {
        // console.log(evt.target)
        const selectedDay = evt.target.innerText;
        if(daysSelected.includes(selectedDay)) {
            evt.target.removeAttribute('class', 'bg-primary')
            const newDaysSelected = daysSelected.filter(d => d != selectedDay)
            setDaysSelected(newDaysSelected )
            return;
        }
        setDaysSelected([...daysSelected, selectedDay]);
        evt.target.setAttribute('class', 'bg-primary');
    }

    return (
        <div>
            <div class="container">
                <div class="courseInfo">
                    <h4>Enter Course Information</h4>
                    <div class="infoCard">
                        <div class="courseStudents">
                            <div class="ccode border">
                                <label for="course-code">Course Code</label>
                                <input type="text" class="form-control" multiple="multiple" data-searchContain="true" data-searchContain="true" class="flexdatalist form-control" name="courseCode" id="courseCode" placeholder="e.g CSC301" value={courseCode} onChange={handleCourseCodeChange} list="courses" required />
                                <datalist id="courses">
                                    <option value="CSC301">CSC301</option>
                                    <option value="CVE301">CVE301</option>
                                    <option value="MTH301">MTH301</option>
                                    <option value="MSE201">MSE201</option>
                                    <option value="CHM101">CHM101</option>
                                </datalist>
                            </div>
                            <div class="students border">
                                <label for="number-of-students">Number of Students</label>
                                <input type="text" class="form-control" name="courseCode" id="courseCode" placeholder="e.g 300" value={numStudents} onChange={handleNumStudentsChange} required />
                            </div>
                        </div>
                        <div class="dept border" ref={divSelect}>
                            <label for="departments">Departments Taking the Course</label>
                            {/* {divButtons} */}
                            <input type="text" class="form-control " name="courseCode" id="courseCode" placeholder="e.g CSC300" onChange={handleDepartmentSelect} list="departments" required />

                            <datalist id="departments">
                                {
                                    depts.map(dept => {
                                        return <option key={dept.id} value={dept.code} id={dept.id}>{dept.name}</option>
                                    })
                                }
                            </datalist>
                            {/* <select onChange={handleDepartmentSelect}>
                                {depts.map((dept) => {
                                    return <option key={dept.id} value={dept.code} id={dept.id}>{dept.name}</option>
                                })}
                            </select> */}
                        </div>

                        <div class="days border">
                            <label for="preferred-days">Preferred Days</label>
                            <div class="days_btn" onClick={handleDaysClick}>
                                <button>Monday</button>
                                <button>Tuesday</button>
                                <button>Wednesday</button>
                                <button>Thursday</button>
                                <button>Friday</button>
                            </div>
                        </div>
                        <div>
                            <button class="btn-del">Delete</button>
                            <button class="btn btn-add">Add Course</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CourseEntry;