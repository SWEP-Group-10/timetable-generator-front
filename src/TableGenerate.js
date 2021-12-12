function GenerateTable() {
    return (
        <div class="header container">
            <h1><i class="far fa-arrow-alt-circle-left"></i>Timetable</h1>
            <div class="rightSide">
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
                    <label for="Course">Course</label>
                    <select class="form-select form-select-sm" aria-label=".form-select-lg example">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>

                <div>
                    <label for="Course">Course</label>
                    <select class="form-select form-select-sm" aria-label=".form-select-lg example">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>

                <button class="lecture btn btn-light">Lecture Room Info</button>
            </div>
        </div>

    );
}

export default GenerateTable;