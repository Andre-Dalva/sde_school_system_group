import {fetchClasses} from "../API/coursesAPI.js";
import { createNewClass } from "../API/coursesAPI.js";

class CreateCourses {
    constructor(courseName, classroom) {
        this.courseName = courseName;
        this.classroom = classroom;
    }

    set courseName(newCourseName) {
        if (newCourseName == "") throw new Error("Course name cannot be empty");
        else this._courseName = newCourseName;
    }
    set classroom(newClassroom) {
        if (newClassroom == "") throw new Error("Classroom cannot be empty");
        else this._classroom = newClassroom;
    }

    get courseName() { return this._courseName; }
    get classroom() { return this._classroom; }

}

async function addNewCourse(creatingBox) {
    const courseNameInput = document.getElementById("courseName");
    const classroomInput = document.getElementById("inputClassroom");

    courseNameInput.classList.remove("input-error");
    classroomInput.classList.remove("input-error");

    try {
        const localCourse = new CreateCourses(courseNameInput.value, classroomInput.value);
        const apiData = {
            "title": localCourse.courseName,
            "roomId": localCourse.classroom,
        }
        const newCourseFromAPI = await createNewClass(apiData);

        if (newCourseFromAPI) {
            creatingBox.remove();
            fetchClasses();
        }

    } catch (error) {
        const newPlaceholderText = "This cannot be empty";

        if (error.message.includes("Course name")) {
            courseNameInput.placeholder = newPlaceholderText;
            courseNameInput.classList.add("input-error");
            courseNameInput.focus(); 
        } 
        
        else if (error.message.includes("Classroom")) {
            classroomInput.placeholder = newPlaceholderText;
            classroomInput.classList.add("input-error");
            classroomInput.focus();
        }
        console.error("Form Validation Error:", error.message);
        return;
    }
}

export function startToCreate(courseBody, addBox) {
    addBox.remove();
    const addCourse = document.createElement("div");

    addCourse.className = "course";
    addCourse.id = "newCourse";
    addCourse.innerHTML = `
        <div id="nameContainerNew">
            <h2 class="courseTitle">
                <input type="text" class="courseInput" id="courseName" placeholder="Course name...">
            </h2>
        </div>

        <div class="courseDetailsNew">
            Classroom: <span class="classNumber"><input type="text" class="courseInput" id="inputClassroom" placeholder="..." ></span>
        </div>

        <div id="saveCourseBox">
            <button id="saveCourse" class="formButton">Save</button>
            <button class="formButton cancelButton" type="reset" id="cancelButton">Cancel</button>
        </div>
    `;

    courseBody.append(addCourse);
    const saveButton = document.getElementById("saveCourse");
    const cancelButton = document.getElementById("cancelButton");
    saveButton.onclick = () => addNewCourse(addCourse);
    cancelButton.onclick = () => addCourse.remove();
}