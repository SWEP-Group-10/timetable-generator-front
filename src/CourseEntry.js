import { useState, useEffect, useRef } from "react";
import {useAuth} from "./auth/provider";

import { departments as deptEndpoint, courses as coursesEndpoint, departments } from "./api_endpoints";

import {MutatingDots} from "react-loader-spinner"

// const deptEndpointLocal = "http://localhost:3003/departments"

function CourseEntry() {
    const [courseCode, setCourseCode] = useState("");
    const [numStudents, setNumStudents] = useState(0);
    const [depts, setDepts] = useState([]);
    const [deptCode, setDeptCode] = useState([]);
    const [daysSelected, setDaysSelected] = useState([]);
    const [daySelected, setDaySelected] = useState({});
    const [addcourseLoading, setAddcourseLoading] = useState(false);
    
    
    // helper function to clear all form state
    function clearForm() {
        setCourseCode("");
        setNumStudents(0);
        setDaySelected({});
        setDeptCode([]);
        setDaysSelected([]);
        // remove all selected depts and clear form
        divSelect.current.innerHTML = '';
}

    const divSelect = useRef();
    // BEARER TOKEN
    const {bearerToken} = useAuth();

    useEffect(() => {
        fetch(deptEndpoint, {headers: {Authorization: `Bearer ${bearerToken}`}})
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
            setDaySelected({...daySelected, [selectedDay]: false});
            const newDaysSelected = daysSelected.filter(d => d != selectedDay)
            setDaysSelected(newDaysSelected)
            return;
        }
        setDaySelected({...daySelected, [selectedDay]: true});
        setDaysSelected([...daysSelected, selectedDay]);
    }

    function handleAddCourseClick(evt) {
        evt.preventDefault();
        setAddcourseLoading(true);
        async function postCourse(url = '', data = {}) {
            //
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'apllication/json',
                    Authorization: `Bearer ${bearerToken}`
                },
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
            setAddcourseLoading(false)
            clearForm();
        })
        .catch(err => {
            console.error("COURSE ADD ERROR");
            console.error(err);
            setAddcourseLoading(false);
        });
    }

    function handleDeleteClick() {
        setDaySelected({});
        setDaysSelected([]);
        clearForm()
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
                        <div class="dept border">
                            <label for="departments">Departments Taking the Course</label>
                            <input type="text" class="form-control " name="courseCode" id="courseCode" placeholder="e.g CSC300" onChange={handleDepartmentSelect} list="departments" required />

                            <datalist id="departments">
                                {
                                    depts.map(dept => {
                                        return <option key={dept.id} value={dept.code} id={dept.id}>{dept.name}</option>
                                    })
                                }
                            </datalist>
                            {/* empty div to append all selected deartments */}
                            <div class="" ref={divSelect}></div>
                        </div>

                        <div class="days border">
                            <label for="preferred-days">Preferred Days</label>
                            <div class="days_btn" onClick={handleDaysClick}>
                                <button className={daySelected["Monday"] ? "bg-primary": ""}>Monday</button>
                                <button className={daySelected["Tuesday"] ? "bg-primary": ""}>Tuesday</button>
                                <button className={daySelected["Wednesday"] ? "bg-primary": ""}>Wednesday</button>
                                <button className={daySelected["Thursday"] ? "bg-primary": ""}>Thursday</button>
                                <button className={daySelected["Friday"] ? "bg-primary": ""}>Friday</button>
                            </div>
                        </div>
                        <div>
                            <button class="btn-del" onClick={handleDeleteClick}>Delete</button>
                            {
                                !addcourseLoading ? (
                                    <button class="btn btn-add" onClick={handleAddCourseClick}>Add Course</button>
                                ): (
                                <span class="mutating-dots">
                                    <MutatingDots arialLabel="loading-indicator"  color="blue" secondaryColor="grey"/>
                                </span>)
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CourseEntry;