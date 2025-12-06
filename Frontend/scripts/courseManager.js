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
            <button id="saveCourse">Save</button>
        </div>
    `;

    courseBody.insertBefore(addCourse,addBox);
    const saveButton = document.getElementById("saveCourse");
    saveButton.onclick = addNewCourse;
}