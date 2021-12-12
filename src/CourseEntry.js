function CourseEntry() {
    return (
        <div>
            <div class="container">
                <div class="courseInfo">
                    <h4>Enter Course Information</h4>
                    <div class="infoCard">
                        <div class="courseStudents">
                            <div class="ccode border">
                                <label for="course-code">Course Code</label>
                                <input type="text" class="form-control" name="courseCode" id="courseCode" placeholder="e.g CSC301" list="courses" required />
                            </div>
                            <datalist id="courses">
                                <option value="CSC301">CSC301</option>
                                <option value="CVE301">CVE301</option>
                                <option value="MTH301">MTH301</option>
                                <option value="MSE201">MSE201</option>
                                <option value="CHM101">CHM101</option>
                            </datalist>
                            <div class="students border">
                                <label for="number-of-students">Number of Students</label>
                                <input type="text" class="form-control" name="courseCode" id="courseCode" placeholder="e.g 300" required />
                            </div>
                        </div>
                        <div class="dept border">
                            <label for="departments">Departments Taking the Course</label>
                            <input type="text" class="form-control " name="courseCode" id="courseCode" placeholder="e.g CSC300" required />
                        </div>

                        <div class="days border">
                            <label for="preferred-days">Preferred Days</label>
                            <div class="days_btn">
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