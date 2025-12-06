const courses = [];

class CreateCourses{
    constructor(courseName,teacherName,classroom,){
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.classroom = classroom;
    }

    set courseName(newCourse){
        if(newCourse == "") window.alert("Course Name is Empty");
        else this._courseName = newCourse;
    }

    set teacherName(newteacherName){
        if(newteacherName == "") window.alert("Teacher Name is Empty");
        else this._teacherName = newteacherName;
    }

    set classroom(newClassroom){
        if(newClassroom == "") window.alert("Classroom is empty");
        else this._classroom = newClassroom;
    }

    get courseName(){
        return this._courseName;
    }

    get teacherName(){
        return this._teacherName;
    }

    get classroom(){
        return this._classroom;
    }
}

function addNewCourse(){
    const course = new CreateCourses(document.getElementById("courseName").value, document.getElementById("inputTutorName").value, Number(document.getElementById("inputClassroom").value));

    courses.push(course);
    console.log(courses);
}

export function startToCreate(courseBody,addBox){
    const addCourse = document.createElement("div");

    addCourse.className = "course";
    addCourse.id = "newCourse";
    addCourse.innerHTML =  `
        <div id="nameContainerNew">
            <h2 class="courseTitle">
                <input type="text" class="courseInput" id="courseName" placeholder="Course name...">
            </h2>
        </div>

        <div class="courseDetailsNew">
            Classroom: <span class="classNumber"><input type="text" class="courseInput" id="inputClassroom" placeholder="..." ></span>
        </div>

        <div class="courseDetailsNew">
            Tutor: <span class="tutorName"><input type="text" placeholder="Tutor name..." class="courseInput" id="inputTutorName"></span>
        </div>

        <div id="saveCourseBox">
            <button id="saveCourse" class="formButton">Save</button>
            <button class="formButton cancelButton" type="reset" id="cancelButton">Cancel</button>
        </div>
    `;

    courseBody.insertBefore(addCourse,addBox);
    const saveButton = document.getElementById("saveCourse");
    const cancelButton = document.getElementById("cancelButton");
    saveButton.onclick = addNewCourse;
    cancelButton.onclick = ()=> addCourse.remove();
}

export function editing(all) {
    const editingSave = document.getElementById("editingSave");
    editingSave.style.display = "block";

    document.getElementById("cancelEditing").onclick = () => location.reload();

    // Show the editable fields
    all.forEach(course => {
        course.style.display = "block";
    });

    // Attach edit behavior
    const edits = document.querySelectorAll(".edit");

    
    edits.forEach(edit => {
        let on = 0;
        edit.addEventListener("click", () => {
            const editingOption = edit.closest(".course").querySelector(".editingOptions");
            if(on) {
                editingOption.style.display = "none";
                on = 0;
            }
            else{
                editingOption.style.display = "block";
                on = 1;
            }
        });
    });
}
