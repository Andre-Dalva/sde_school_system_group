import {addNewCourse } from "./courseManager.js";

function startToCreate(){
    const courseBody = document.getElementById("allCourses");
    const addCourse = document.createElement("div");
    addCourse.className = "course"
    const addBox = document.getElementById("newCourse");

    courseBody.insertBefore(addCourse,addBox);
    addCourse.innerHTML =  `<div id="saveCourseBox"><button id="saveCourse" type="submit">Save</button></div>
                <div class="courseInfo">
                    <h2 class="courseTitle"><input type="text" name="" id="courseName" placeholder="Course name..." class="courseInput"></h2>
                    <p class="courseDetails">Classroom: <span class="classNumber"><input type="text" name="" id="inputClassroom" placeholder="..." class="courseInput"></span> <br> 
                        Tutor: <span class="tutorName"><input type="text" placeholder="Tutor name..." class="courseInput" id="inputTutorName"></span>
                    </p>
                </div>`;
    const saveButton = document.getElementById("saveCourse");
    saveButton.onclick = addNewCourse;
}

const addSign = document.getElementById("addSign");
addSign.addEventListener("click",startToCreate);