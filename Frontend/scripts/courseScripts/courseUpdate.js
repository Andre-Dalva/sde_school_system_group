import { fetchClasses } from "../API/coursesAPI.js";
import { deleteCourse } from "./courseDelete.js";
import { sendUpdateToAPI } from "../API/coursesAPI.js";
export function editing(all) {
    const editingSave = document.getElementById("editingSave");
    editingSave.style.display = "block";

    document.getElementById("cancelEditing").onclick = () => {
        const coursesToRevert = document.querySelectorAll(".course.edit-mode");
        coursesToRevert.forEach(course => {
            revertLocalEdit(course);
        });
    };

    all.forEach(course => {
        course.style.display = "block";
    });

    const edits = document.querySelectorAll(".edit");

    edits.forEach(edit => {
        let on = 0;
        edit.addEventListener("click", () => {
            const courseContainer = edit.closest(".course");
            const editingOption = courseContainer.querySelector(".editingOptions");

            if (on) {
                editingOption.style.display = "none";
                on = 0;
            } else {
                editingOption.style.display = "block";
                on = 1;

                const editButton = editingOption.querySelector(".editCourse");
                const deleteButton = editingOption.querySelector(".deleteCourse");

                editButton.onclick = () => enableLocalEdit(courseContainer);

                deleteButton.onclick = () => deleteCourse(courseContainer);
            }
        });
    });

    editingSave.onclick = () => {
        const coursesToSave = document.querySelectorAll(".course.edit-mode");

        if (coursesToSave.length === 0) {
            alert("No courses were modified to save.");
            return;
        }

        coursesToSave.forEach(courseElement => {
            updateCourse(courseElement, revertLocalEdit, fetchClasses);
        });
    };
}

function enableLocalEdit(courseContainer) {
    const titleElement = courseContainer.querySelector(".courseTitle");
    const classroomElement = courseContainer.querySelector(".classNumber");
    const editingOptions = courseContainer.querySelector(".editingOptions");


    courseContainer.classList.add("edit-mode");
    if (editingOptions) editingOptions.style.display = "none";
    document.getElementById("editingSave").style.display = "block";
    document.getElementById("cancelEditing").style.display = "block";


    const currentTitle = titleElement.textContent.trim();
    titleElement.innerHTML = `
        <input type="text" 
               value="${currentTitle}" 
               class="courseInput large" 
               data-field="title"
               placeholder="Course name...">
    `;

    const currentClassroom = classroomElement.textContent.trim();
    classroomElement.innerHTML = `
        <input type="text" 
               value="${currentClassroom}" 
               class="courseInput small" 
               data-field="roomId"
               placeholder="...">
    `;
}

function revertLocalEdit(courseContainer, dataFromSave = null) {
    const titleElement = courseContainer.querySelector(".courseTitle");
    const classroomElement = courseContainer.querySelector(".classNumber");
    const courseDetailsP = courseContainer.querySelector(".courseDetails");

    const tutorName = courseContainer.querySelector(".tutorName")?.textContent.trim() || 'Tutor Not Assigned';

    const newTitle = dataFromSave ? dataFromSave.title : courseContainer.querySelector("input[data-field='title']")?.value || '';
    const newClassroom = dataFromSave ? dataFromSave.roomId : courseContainer.querySelector("input[data-field='roomId']")?.value || '';


    titleElement.innerHTML = `${newTitle}`;

    courseDetailsP.innerHTML = `
        Classroom: <span class="classNumber">${newClassroom}</span> <br>
        Tutor: <span class="tutorName">${tutorName}</span>
    `;

    courseContainer.classList.remove("edit-mode");
    document.getElementById("editingSave").style.display = "none";
    document.getElementById("cancelEditing").style.display = "none";
}

async function updateCourse(courseElement, revertLocalEditFn,   fetchClassesFn) {

    const courseId = courseElement.dataset.id;

    if (!courseId) {
        console.error("Update failed: Course ID is missing.");
        return;
    }

    const courseNameInput = courseElement.querySelector("input[data-field='title']");
    const classroomInput = courseElement.querySelector("input[data-field='roomId']");

    if (!courseNameInput || courseNameInput.value.trim() === "" ||
        !classroomInput || classroomInput.value.trim() === "") {
        alert("Course name and Classroom cannot be empty.");
        return;
    }

    const apiData = {
        "title": courseNameInput.value.trim(),
        "roomId": classroomInput.value.trim()
    };

    try {
        await sendUpdateToAPI(courseId, apiData);

        revertLocalEditFn(courseElement, apiData);;

        fetchClassesFn();

    } catch (error) {
        console.error(`Failed to save changes for Course ID ${courseId}:`, error);
        alert("Failed to save course changes. Check console for details.");
    }
}