import { useEffect, useState } from 'react/cjs/react.development'
import {
  departments,
  venues as venuesEndpoint,
  courses as coursesEndpoint,
} from './api_endpoints'
import useCourses from './hooks/useTableCourses'

import {useAuth} from "./auth/provider";

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import Modal from 'react-modal/lib/components/Modal'

function GenerateTable() {
  const [depts, setDepts] = useState([])
  const [venues, setVenues] = useState([])
  const [courses, setCourses] = useState([])
  const [tableEntry, setTableEntry] = useState({})
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedDeptID, setSelectedDeptID] = useState('')
  const [deptCourses, setDeptCourses] = useState([])
  const [byCourse, setByCourse] = useState(true)
  const [courseFilter, setCourseFilter] = useState(false);
  // use the table courses hook
  const { getTableCourses, setTableCourses } = useCourses({})
  // modal state
  const [modalIsOpen, setModalIsOpen] = useState(false)
  
  // BEARER TOKEN
  const {bearerToken} = useAuth();

  useEffect(() => {
    fetch(departments, {headers: {Authorization: `Bearer ${bearerToken}`}})
      .then((response) => response.json())
      .then((resData) => {
        setDepts(resData)
      })
      .catch(console.error)

    fetch(venuesEndpoint, {headers: {Authorization: `Bearer ${bearerToken}`}})
      .then((response) => response.json())
      .then((resData) => {
        setVenues(resData)
      })
      .catch(console.error)

    fetch(coursesEndpoint, {headers: {Authorization: `Bearer ${bearerToken}`}})
      .then((response) => response.json())
      .then((resData) => {
        setCourses(resData)
      })
      .catch(console.error)
  }, [])

  function handleCourseUpdate(evt) {
    const selectedCourseCode = evt.target.value
    setCourseFilter(true);
    setSelectedCourse(selectedCourseCode)
    setTableCourses({}) // clears the state
    const selectedcourse = courses.find(
      (course) => course.code == selectedCourseCode,
    )
    selectedcourse.periods.forEach((period) => {
      const day = period.day;
      const venue = period.venue.name;
      setTableCourses({ ...getTableCourses(), [day]: { [period.start]: true, venue } })
    })
    setByCourse(true)
  }

  function handleDeptUpdate(evt) {
    const deptID = evt.target.value
    setCourseFilter(false);
    setSelectedDeptID(deptID)
    const deptCourses = courses.filter((course) => {
      return course.departments.find((dept) => dept.id == deptID) ? true : false
    })
    // set courses offered by a department
    setDeptCourses(deptCourses)
    setByCourse(false)
  }

  function getDeptCourses(courses, day, start) {
    let courseWithVenue = {}
    const foundCourse = courses.find((course) => {
      const coursePeriod = course.periods.find(
        (period) => period.day == day && period.start == start,
      )
      if (coursePeriod) {
        courseWithVenue['venue'] = coursePeriod?.venue?.name || ''
        return true
      }
      return false
    })
    courseWithVenue = { ...foundCourse, ...courseWithVenue }
    return courseWithVenue
  }

  // EXPORT DOCUMENT AS PDF
  function handleExport() {
    html2canvas(document.querySelector("#timetable-main"))
    .then(canvas => {
      const imageData = canvas.toDataURL("image/png")
      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 0, 0)
      pdf.save("timetable.pdf")
    }).then(() => setModalIsOpen(false))
  }

  return (
    <div>
      {/* <h1>
        <i class="far fa-arrow-alt-circle-left"></i>Timetable
      </h1> */}
        <div class="container d-flex justify-content-center">

          {/* Course filter */}
          <div class="col-lg-3">
            <label class="text-muted h6" for="Course">
              Course
            </label>
            <select
              class="form-select form-select-sm"
              aria-label=".form-select-lg example"
              onChange={handleCourseUpdate}
            >
              <option selected={!courseFilter} disabled>ALL</option>
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code}
                </option>
              ))}
            </select>
          </div>

          {/* Department filter */}
          <div class="col-lg-3">
            <label class="text-muted h6" for="Course">
              Departments
            </label>
            <select
              class="form-select form-select-sm"
              aria-label=".form-select-lg example"
              onChange={handleDeptUpdate}
            >
              <option selected={courseFilter} disabled>ALL</option>
              {depts.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div class="col-lg-3">
            <label class="text-muted h6" for="Course">
              LectureRoom
            </label>
            <select
              class="form-select form-select-sm"
              aria-label=".form-select-lg example"
            >
              <option value="All">ALL LT</option>
              {/* {venues.map((venue) => (
                <option key={venue.code} value={venue.name}>
                  {venue.name}
                </option>
              ))} */}
            </select>
          </div>
          
          <div class="col-lg-2 col-md-auto align-self-end">
            <button 
              class="btn btn-light text-primary timetable-export"
              onClick={() => setModalIsOpen(true)}>
              EXPORT
            </button>
          </div>
        </div>

        <div class="border-bottom"></div>

        {/* TABLE STARTS HERE */}
        <div class="container-fluid mt-5 text-center">
          <table id="timetable-main" class="table table-bordered">
            <thead>
              <tr>
                <th class="text-muted border no-border" scope="col">
                  Time
                </th>
                <th class="text-muted" scope="col">
                  Monday
                </th>
                <th class="text-muted" scope="col">
                  Tuesday
                </th>
                <th class="text-muted" scope="col">
                  Wednesday
                </th>
                <th class="text-muted" scope="col">
                  Thursday
                </th>
                <th class="text-muted" scope="col">
                  Friday
                </th>
              </tr>
            </thead>
            {byCourse ? (
                // FILTER BY COURSE TABLE
              <tbody>
                <tr>
                  <td class="text-muted" scope="row">
                    8AM-9AM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['8'] ? selectedCourse : ''}
                    <p>{getTableCourses()?.['Monday']?.['8'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['8']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['8'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['8']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['8'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['8']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['8'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['8'] ? selectedCourse : ''}
                    <p>{getTableCourses()?.['Friday']?.['8'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    9AM-10AM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['9'] ? selectedCourse : ''}
                    <p>{getTableCourses()?.['Monday']?.['9'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['9']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['9'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['9']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['9'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['9']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['9'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['9'] ? selectedCourse : ''}
                    <p>{getTableCourses()?.['Friday']?.['9'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    10AM-11AM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['10']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Monday']?.['10'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['10']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['10'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['10']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['10'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['10']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['10'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['10']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Friday']?.['10'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    11AM-12PM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['11']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Monday']?.['11'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['11']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['11'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['11']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['11'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['11']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['11'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['11']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Friday']?.['11'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    12PM-1PM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['12']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Monday']?.['12'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['12']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['12'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['12']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['12'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['12']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['12'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['12']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Friday']?.['12'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    1PM-2PM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['13']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Monday']?.['13'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['13']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['13'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['13']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['13'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['13']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['13'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['13']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Friday']?.['13'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    2PM-3PM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['14']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Monday']?.['14'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['14']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['14'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['14']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['14'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['14']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['14'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['14']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Friday']?.['14'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    3PM-4PM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['15']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Monday']?.['15'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['15']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['15'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['15']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['15'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['15']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['15'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['15']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Friday']?.['15'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    4PM-5PM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['16']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Monday']?.['16'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['16']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['16'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['16']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['16'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['16']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['16'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['16']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Friday']?.['16'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    5PM-6PM
                  </td>
                  <td>
                    {getTableCourses()?.['Monday']?.['17']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Monday']?.['17'] && getTableCourses()?.["Monday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Tuesday']?.['17']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Tuesday']?.['17'] && getTableCourses()?.["Tuesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Wednesday']?.['17']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Wednesday']?.['17'] && getTableCourses()?.["Wednesday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Thursday']?.['17']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Thursday']?.['17'] && getTableCourses()?.["Thursday"]?.venue}</p>
                  </td>
                  <td>
                    {getTableCourses()?.['Friday']?.['17']
                      ? selectedCourse
                      : ''}
                      <p>{getTableCourses()?.['Friday']?.['17'] && getTableCourses()?.["Friday"]?.venue}</p>
                  </td>
                </tr>
              </tbody>
            ) : (
                // FILTER BY DEPARTMENTS TABLE
              <tbody>
                <tr>
                  <td class="text-muted" scope="row">
                    8AM-9AM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '8')?.code}
                    <p>
                      {getDeptCourses(deptCourses, 'Monday', '8')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '8')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '8')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '8')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '8')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '8')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Thursday', '8')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '8')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '8')?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    9AM-10AM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '9')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Monday', '9')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '9')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '9')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '9')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '9')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '9')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Thursday', '9')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '9')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '9')?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    10AM-11AM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '10')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Monday', '10')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '10')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '10')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '10')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '10')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '10')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Thursday', '10')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '10')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '10')?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    11AM-12PM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '11')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Monday', '11')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '11')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '11')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '11')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '11')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '11')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Thursday', '11')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '11')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '11')?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    12PM-1PM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '12')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Monday', '12')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '12')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '12')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '12')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '12')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '12')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Thursday', '12')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '12')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '12')?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    1PM-2PM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '13')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Monday', '13')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '13')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '13')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '13')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '13')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '13')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Thursday', '13')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '13')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '13')?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    2PM-3PM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '14')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Monday', '14')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '14')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '14')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '14')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '14')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '14')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Thursday', '14')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '14')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '14')?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    3PM-4PM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '15')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Monday', '15')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '15')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '15')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '15')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '15')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '15')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Thursday', '15')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '15')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '15')?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    4PM-5PM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '16')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Monday', '16')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '16')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '16')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '16')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '16')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '16')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Thursday', '16')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '16')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '16')?.venue}</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-muted" scope="row">
                    5PM-6PM
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Monday', '17')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Monday', '17')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Tuesday', '17')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Tuesday', '17')?.venue}</p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Wednesday', '17')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Wednesday', '17')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Thursday', '17')?.code}{' '}
                    <p>
                      {getDeptCourses(deptCourses, 'Thursday', '17')?.venue}
                    </p>
                  </td>
                  <td>
                    {getDeptCourses(deptCourses, 'Friday', '17')?.code}{' '}
                    <p>{getDeptCourses(deptCourses, 'Friday', '17')?.venue}</p>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
          <Modal
            isOpen={modalIsOpen}
            className="Modal">
            <p>Save your timetable</p>
            <div class="vh-" id="export" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-body">
                <div class="col-12 mt-3 p-2 border rounded-3">
                  <label class="text-muted text-left" for="export">Timetable name</label>
                  <input type="text" class="form-control border-0" name="courseCode" id="courseCode" placeholder="CSC300 timetable" required />
                </div>
            </div>
            <div class="modal-footer">
              <button class="modal-btn btn btn-gray" onClick={() => setModalIsOpen(false)}>CANCEL</button>
              <button class="modal-btn btn btn-primary" onClick={handleExport}>SAVE</button>
            </div>
            </div>
          </Modal>
        </div>
    </div>
  )
}

export default GenerateTable
