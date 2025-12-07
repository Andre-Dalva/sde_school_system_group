import { fetchClasses } from "./courseRead.js";
import { startToCreate } from "./courseCreate.js";
import { deleteCourse } from "./courseDelete.js";
import { enableLocalEdit, revertLocalEdit, updateCourse} from "./courseUpdate.js"; 

fetchClasses(startToCreate);

function editing(all) {
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
    
    // --- FIX 4: Add the Global Save Handler ---
    editingSave.onclick = () => {
        const coursesToSave = document.querySelectorAll(".course.edit-mode");
        
        if (coursesToSave.length === 0) {
            alert("No courses were modified to save.");
            return;
        }

        coursesToSave.forEach(courseElement => {
            // Call updateCourse, passing the two required functions (revertLocalEdit and fetchClasses)
            updateCourse(courseElement, revertLocalEdit, fetchClasses);
        });
        // Note: Global buttons are hidden by the revertLocalEdit call inside updateCourse
    };
}

const editingSetter = document.getElementById("editingSetter");
editingSetter.onclick = () => editing(Array.from(document.getElementsByClassName("edit")));