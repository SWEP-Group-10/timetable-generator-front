function LectureRoomEntry() {
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
                                <label for="course-code">Course Code</label>
                                <input type="text" class="form-control" name="courseCode" id="courseCode" placeholder="e.g HSLT C" list="courses" required />
                            </div>
                            <datalist id="courses">
                                <option value="HSLT C">HSLT C</option>
                                <option value="BOO A">BOO A</option>
                                <option value="1K LT">1K LT</option>
                                <option value="FB LT">FB LT</option>
                                <option value="AMPHI">AMPHI</option>
                            </datalist>
                            <div class="students border">
                                <label for="number-of-students">Capacity (Students)</label>
                                <input type="text" class="form-control" name="courseCode" id="courseCode" placeholder="e.g 300" required />
                            </div>
                        </div>
                        <div>
                            <button class="btn-del-lect">Delete</button>
                            <button class="btn btn-add-lect">Add Course</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LectureRoomEntry;