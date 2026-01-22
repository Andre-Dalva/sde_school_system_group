import { fetchClasses, sendUpdateToAPI } from "../API/coursesAPI.js";
import { deleteCourse } from "./courseDelete.js";

export function editing(all) {
    const editingSave = document.getElementById("editingSave");
    const editingCancel = document.getElementById("cancelEditing");

    editingSave.style.display = "inline-block";
    editingCancel.style.display = "inline-block";

    // 1. CANCEL HANDLER FIX: Revert all courses marked as 'edit-mode'
    editingCancel.onclick = () => {
        const coursesToRevert = document.querySelectorAll(".course.edit-mode");
        coursesToRevert.forEach(course => {
            revertLocalEdit(course);
        });
        
        editingSave.style.display = "none";
        editingCancel.style.display = "none";
        fetchClasses(); 
    };

    all.forEach(course => {
        course.style.display = "inline-block";
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
                editingOption.style.display = "inline-block";
                on = 1;

                const editButton = editingOption.querySelector(".editCourse");
                const deleteButton = editingOption.querySelector(".deleteCourse");

                editButton.onclick = () => enableLocalEdit(courseContainer);

                deleteButton.onclick = () => deleteCourse(courseContainer);
            }
        });
    });

    // 2. SAVE HANDLER FIX: Use Promise.allSettled for concurrent updates and single refresh
    editingSave.onclick = async () => {
        const coursesToSave = document.querySelectorAll(".course.edit-mode");

        if (coursesToSave.length === 0) {
            alert("No courses were modified to save.");
            return;
        }

        const savePromises = [];
        let successCount = 0;
        let failCount = 0;

        coursesToSave.forEach(courseElement => {
            savePromises.push(
                updateCourse(courseElement, revertLocalEdit)
                    .then(() => { successCount++; })
                    .catch(() => { failCount++; })
            );
        });
        
        // Wait for ALL updates (successful or failed) to complete
        await Promise.allSettled(savePromises);

        alert(`Saving complete: ${successCount} successful, ${failCount} failed.`);
        
        // Hide global buttons and refresh the list once
        editingSave.style.display = "none";
        editingCancel.style.display = "none";
        fetchClasses(); 
    };
}

// 3. FIX: STORES ORIGINAL DATA BEFORE EDITING
function enableLocalEdit(courseContainer) {
    const titleElement = courseContainer.querySelector(".courseTitle");
    const classroomElement = courseContainer.querySelector(".classNumber");
    const editingOptions = courseContainer.querySelector(".editingOptions");

    // Extract current text content for storage
    const originalTitle = titleElement.textContent.trim();
    const originalClassroom = classroomElement.textContent.trim();
    
    // Store original values as data attributes
    courseContainer.dataset.originalTitle = originalTitle;
    courseContainer.dataset.originalRoomId = originalClassroom;
    
    courseContainer.classList.add("edit-mode");
    if (editingOptions) editingOptions.style.display = "none";
    document.getElementById("editingSave").style.display = "inline-block";
    document.getElementById("cancelEditing").style.display = "inline-block";

    
    titleElement.innerHTML = `
        <input type="text" 
               value="${originalTitle}" 
               class="courseInput" 
               data-field="title"
               placeholder="Course name...">
    `;

    classroomElement.innerHTML = `
        <input type="text" 
               value="${originalClassroom}" 
               class="courseInput classroomInput" 
               data-field="roomId"
               placeholder="...">
    `;
}

// 4. FIX: USES STORED DATA FOR CANCELLATION
function revertLocalEdit(courseContainer, dataFromSave = null) {
    const titleElement = courseContainer.querySelector(".courseTitle");
    const courseDetailsP = courseContainer.querySelector(".courseDetails");

    const tutorName = courseContainer.querySelector(".tutorName")?.textContent.trim() || 'Tutor Not Assigned';

    const newTitle = dataFromSave 
        ? dataFromSave.title 
        : courseContainer.dataset.originalTitle || titleElement.textContent.trim();
        
    const newClassroom = dataFromSave 
        ? dataFromSave.roomId 
        : courseContainer.dataset.originalRoomId || '';

    titleElement.innerHTML = `${newTitle}`;

    courseDetailsP.innerHTML = `
        Classroom: <span class="classNumber">${newClassroom}</span> <br>
        Tutor: <span class="tutorName">${tutorName}</span>
    `;

    courseContainer.classList.remove("edit-mode");
}

// 5. ADJUSTMENT: Removed fetchClassesFn call as it's handled by Promise.allSettled
async function updateCourse(courseElement, revertLocalEditFn) {
    const courseId = courseElement.dataset.id;

    if (!courseId) {
        console.error("Update failed: Course ID is missing.");
        throw new Error("Missing Course ID");
    }

    const courseNameInput = courseElement.querySelector("input[data-field='title']");
    const classroomInput = courseElement.querySelector("input[data-field='roomId']");

    if (!courseNameInput || courseNameInput.value.trim() === "" ||
        !classroomInput || classroomInput.value.trim() === "") {
        alert("Course name and Classroom cannot be empty.");
        throw new Error("Missing required input data");
    }

    const apiData = {
        "title": courseNameInput.value.trim(),
        "roomId": classroomInput.value.trim()
    };
    
    try {
        await sendUpdateToAPI(courseId, apiData);

        // Revert local edit mode upon successful save using the successful data
        revertLocalEditFn(courseElement, apiData);

    } catch (error) {
        console.error(`Failed to save changes for Course ID ${courseId}:`, error);
        throw error; 
    }
}