import { useEffect, useState } from "react/cjs/react.development";
import {departments, venues as venuesEndpoint, courses as coursesEndpoint} from "./api_endpoints";
import useCourses from "./hooks/useTableCourses";

function GenerateTable() {
    const [depts, setDepts]= useState([]);
    const [venues, setVenues]= useState([]);
    const [courses, setCourses]= useState([]);
    const [tableEntry, setTableEntry]= useState({});
    const [selectedCourse, setSelectedCourse]= useState("");
    // use the table courses hook
    const {getTableCourses, setTableCourses} = useCourses({});

    useEffect(() => {
        fetch(departments)
        .then((response) => response.json())
        .then(resData => {
            setDepts(resData)
            // console.log("departments", resData)
        })
        .catch(console.error)

        fetch(venuesEndpoint)
        .then((response) => response.json())
        .then(resData => {
            setVenues(resData)
        })
        .catch(console.error)

        fetch(coursesEndpoint)
        .then((response) => response.json())
        .then(resData => {
            setCourses(resData)
            // console.log("courses", resData)
        })
        .catch(console.error)
    }, []);

    function handleTableUpdate(evt) {
        const selectedCourseCode = evt.target.value;
        setSelectedCourse(selectedCourseCode)
        setTableCourses({});  // clears the state
        const selectedcourse = courses.find(course => course.code ==selectedCourseCode)
        selectedcourse.periods.forEach(period => {
            const day = period.day;
            setTableCourses({...getTableCourses(), [day]: {[period.start]: true}})
        });
        console.log("tabe entry", getTableCourses())      
    }

    // function handleTableUpdate(evt) {
    //     const selectedCourseCode = evt.target.value;
    //     setSelectedCourse(selectedCourseCode)
    //     setTableEntry({});  // clears the state
    //     const selectedcourse = courses.find(course => course.code ==selectedCourseCode)
    //     selectedcourse.periods.forEach(period => {
    //         const day = period.day;
    //         setTableEntry({...tableEntry, [day]: {[period.start]: true}})
    //     });
    //     console.log("tabe entry", tableEntry)      
    // }

    return (
        <div class="header container">
            <h1><i class="far fa-arrow-alt-circle-left"></i>Timetable</h1>
            <div class="rightSide">
                {/* NO IMPL FOR THIS */}
                <div>
                    <label for="Course">Course</label>
                    <select class="form-select form-select-sm" aria-label=".form-select-lg example" onChange={handleTableUpdate}>
                    {
                            courses.map(course => <option key={course.code} value={course.code}>{course.code}</option>)
                        }
                        {/* <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option> */}
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

                <button class="lecture btn btn-light">EXPORT</button>

                {/* TABLE */}
                <div>
                    <table>
                        <thead>
                            <tr>
                                <td>Time</td>
                                <td>Monday</td>
                                <td>Tuesday</td>
                                <td>Wednesday</td>
                                <td>Thursday</td>
                                <td>Friday</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>8AM-9AM</td>
                                <td>{tableEntry?.["Monday"]?.["8"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["8"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["8"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["8"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["8"] ? selectedCourse:""}</td>
                            </tr>
                            <tr>
                                <td>9AM-10AM</td>
                                <td>{tableEntry?.["Monday"]?.["9"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["9"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["9"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["9"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["9"] ? selectedCourse:""}</td>
                            </tr>
                            <tr>
                                <td>10AM-11AM</td>
                                <td>{tableEntry?.["Monday"]?.["10"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["10"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["10"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["10"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["10"] ? selectedCourse:""}</td>
                            </tr>
                            <tr>
                                <td>11AM-12PM</td>
                                <td>{tableEntry?.["Monday"]?.["11"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["11"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["11"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["11"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["11"] ? selectedCourse:""}</td>
                            </tr>
                            <tr>
                                <td>12PM-1PM</td>
                                <td>{tableEntry?.["Monday"]?.["12"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["12"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["12"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["12"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["12"] ? selectedCourse:""}</td>
                            </tr>
                            <tr>
                                <td>1PM-2PM</td>
                                <td>{tableEntry?.["Monday"]?.["1"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["1"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["1"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["1"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["1"] ? selectedCourse:""}</td>
                            </tr>
                            <tr>
                                <td>2PM-3PM</td>
                                <td>{tableEntry?.["Monday"]?.["2"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["2"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["2"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["2"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["2"] ? selectedCourse:""}</td>
                            </tr>
                            <tr>
                                <td>3PM-4PM</td>
                                <td>{tableEntry?.["Monday"]?.["3"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["3"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["3"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["3"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["3"] ? selectedCourse:""}</td>
                            </tr>
                            <tr>
                                <td>4PM-5PM</td>
                                <td>{tableEntry?.["Monday"]?.["4"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["4"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["4"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["4"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["4"] ? selectedCourse:""}</td>
                            </tr>
                            <tr>
                                <td>5PM-6PM</td>
                                <td>{tableEntry?.["Monday"]?.["5"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Tuesday"]?.["5"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Wednesday"]?.["5"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Thursday"]?.["5"] ? selectedCourse:""}</td>
                                <td>{tableEntry?.["Friday"]?.["5"] ? selectedCourse:""}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}

export default GenerateTable;