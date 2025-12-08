import { fetchClasses, sendUpdateToAPI } from "../API/coursesAPI.js";
import { deleteCourse } from "./courseDelete.js"; // Assuming this is correct

export function editing(all) {
    const editingSave = document.getElementById("editingSave");
    const editingCancel = document.getElementById("cancelEditing"); // Get cancel button reference

    editingSave.style.display = "block";
    editingCancel.style.display = "block"; // Ensure it shows when editing starts

    // 1. CANCEL HANDLER FIX: Revert all courses marked as 'edit-mode'
    editingCancel.onclick = () => {
        const coursesToRevert = document.querySelectorAll(".course.edit-mode");
        coursesToRevert.forEach(course => {
            revertLocalEdit(course);
        });
        
        // Hide global buttons and refresh the list to ensure full cleanup
        editingSave.style.display = "none";
        editingCancel.style.display = "none";
        fetchClasses(); 
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
            // Push the promise-returning function call
            savePromises.push(
                updateCourse(courseElement, revertLocalEdit)
                    .then(() => { successCount++; })
                    .catch(() => { failCount++; }) // Catch individual failures
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
    document.getElementById("editingSave").style.display = "block";
    document.getElementById("cancelEditing").style.display = "block";

    // Replace text with input fields
    titleElement.innerHTML = `
        <input type="text" 
               value="${originalTitle}" 
               class="courseInput large" 
               data-field="title"
               placeholder="Course name...">
    `;

    classroomElement.innerHTML = `
        <input type="text" 
               value="${originalClassroom}" 
               class="courseInput small" 
               data-field="roomId"
               placeholder="...">
    `;
    
    // The previous implementation of reconstructing courseDetailsP might be complex due to the span structure.
    // Ensure the overall course details container reflects the input placement:
    const courseDetailsP = courseContainer.querySelector(".courseDetails");
    if (courseDetailsP) {
        // Find a way to ensure the classroom input is placed correctly within the courseDetails structure
        // If the structure is complex, this area might still require DOM specific adjustment.
    }
}

// 4. FIX: USES STORED DATA FOR CANCELLATION
function revertLocalEdit(courseContainer, dataFromSave = null) {
    const titleElement = courseContainer.querySelector(".courseTitle");
    const courseDetailsP = courseContainer.querySelector(".courseDetails");

    const tutorName = courseContainer.querySelector(".tutorName")?.textContent.trim() || 'Tutor Not Assigned';

    // Prioritize saved data, otherwise use the stored original data for cancellation
    const newTitle = dataFromSave 
        ? dataFromSave.title 
        : courseContainer.dataset.originalTitle || titleElement.textContent.trim();
        
    const newClassroom = dataFromSave 
        ? dataFromSave.roomId 
        : courseContainer.dataset.originalRoomId || '';

    // Reconstruct the Title
    titleElement.innerHTML = `${newTitle}`;

    // Reconstruct the Details (including the classroom span)
    courseDetailsP.innerHTML = `
        Classroom: <span class="classNumber">${newClassroom}</span> <br>
        Tutor: <span class="tutorName">${tutorName}</span>
    `;

    // Final cleanup
    courseContainer.classList.remove("edit-mode");
    // Note: Global button hiding is handled by the main editing function's cleanup.
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
        // Do NOT call fetchClasses here

    } catch (error) {
        console.error(`Failed to save changes for Course ID ${courseId}:`, error);
        throw error; // Re-throw to be caught by Promise.allSettled
    }
}