import { useState, useEffect, useRef } from "react";

import { departments as deptEndpoint, courses as coursesEndpoint, departments } from "./api_endpoints";

const deptEndpointLocal = "http://localhost:3003/departments"

function CourseEntry() {
    const [courseCode, setCourseCode] = useState("");
    const [numStudents, setNumStudents] = useState(0);
    const [depts, setDepts] = useState([]);
    const [deptCode, setDeptCode] = useState([]);
    const [daysSelected, setDaysSelected] = useState([]);


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
        evt.currentTarget.value = ''
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
        if (daysSelected.includes(selectedDay)) {
            evt.target.removeAttribute('class', 'bg-primary')
            const newDaysSelected = daysSelected.filter(d => d != selectedDay)
            setDaysSelected(newDaysSelected)
            return;
        }
        setDaysSelected([...daysSelected, selectedDay]);
        evt.target.setAttribute('class', 'bg-primary');
    }

    function handleAddCourseClick(evt) {
        evt.preventDefault();
        
        async function postCourse(url = '', data = {}) {
            // create form-data to match request 'Content-Type' header
            // const formData  = new FormData();
            // for(const name in data) {
            //   formData.append(name, data[name]);
            // }

            // console.log("formdata", formData.getAll(""))
            // define the 
            const response = await fetch(url, {
                method: 'POST',
                // mode: 'cors', // no-cors, *cors, same-origin
                //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: 'omit', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'apllication/json'
                },
                // redirect: 'follow', // manual, *follow, error
                // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            });
            return response.json();
        }

        // get Dept ID for API call
        const deptIds = deptCode.map(code => {
            return depts.find(dept => dept.code == code)?.id
        });

        console.log(deptIds);

        postCourse(coursesEndpoint, {
            code: courseCode,
            student_count: numStudents,
            departments: deptIds,
            preferred_days: daysSelected

        })
        .then(data => {
            console.log("COURSE ADD SUCCESS")
            console.log(data);
        })
        .catch(err => {
            console.error("COURSE ADD ERROR");
            console.error(err);
        });
    }

    function handleDeleteCourseclick() {
        const daysDiv = document.querySelector(".days_btn");
        const daysBtn = [].slice.call(daysDiv.children);
        daysBtn.forEach(btn => btn.removeAttribute("class", "dept-entry-cancel"));
        setDaysSelected([]);
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
                            <input type="text" class="form-control " name="courseCode" id="courseCode" placeholder="e.g CSC300" onChange={handleDepartmentSelect} list="departments" required />

                            <datalist id="departments">
                                {
                                    depts.map(dept => {
                                        return <option key={dept.id} value={dept.code} id={dept.id}>{dept.name}</option>
                                    })
                                }
                            </datalist>
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
                            <button class="btn-del" onClick={handleDeleteCourseclick}>Delete</button>
                            <button class="btn btn-add" onClick={handleAddCourseClick}>Add Course</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CourseEntry;