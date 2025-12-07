export function enableLocalEdit(courseContainer) {
    const titleElement = courseContainer.querySelector(".courseTitle");
    const classroomElement = courseContainer.querySelector(".classNumber");
    const editingOptions = courseContainer.querySelector(".editingOptions");

    // 1. Set State and Display Global Buttons
    courseContainer.classList.add("edit-mode");
    if (editingOptions) editingOptions.style.display = "none";
    document.getElementById("editingSave").style.display = "block";
    document.getElementById("cancelEditing").style.display = "block"; 

    // 2. Transform Title
    const currentTitle = titleElement.textContent.trim();
    titleElement.innerHTML = `
        <input type="text" 
               value="${currentTitle}" 
               class="courseInput large" 
               data-field="title"
               placeholder="Course name...">
    `;

    // 3. Transform Classroom
    const currentClassroom = classroomElement.textContent.trim();
    classroomElement.innerHTML = `
        <input type="text" 
               value="${currentClassroom}" 
               class="courseInput small" 
               data-field="roomId"
               placeholder="...">
    `;
}

 export function revertLocalEdit(courseContainer, dataFromSave = null) {
    const titleElement = courseContainer.querySelector(".courseTitle");
    const classroomElement = courseContainer.querySelector(".classNumber");
    const courseDetailsP = courseContainer.querySelector(".courseDetails");
    
    // Grabbing the tutor name (which was not modified during edit)
    const tutorName = courseContainer.querySelector(".tutorName")?.textContent.trim() || 'Tutor Not Assigned';
    
    // Determine the values to display: use API response if available, otherwise use input values (for Cancel)
    const newTitle = dataFromSave ? dataFromSave.title : courseContainer.querySelector("input[data-field='title']")?.value || '';
    const newClassroom = dataFromSave ? dataFromSave.roomId : courseContainer.querySelector("input[data-field='roomId']")?.value || '';

    // 1. Revert Title
    titleElement.innerHTML = `${newTitle}`;

    // 2. Revert Classroom & Details (Restoring the full P tag structure)
    courseDetailsP.innerHTML = `
        Classroom: <span class="classNumber">${newClassroom}</span> <br>
        Tutor: <span class="tutorName">${tutorName}</span>
    `;
    
    // 3. Clean up State and Hide Global Buttons
    courseContainer.classList.remove("edit-mode");
    document.getElementById("editingSave").style.display = "none";
    document.getElementById("cancelEditing").style.display = "none";
}

export async function updateCourse(courseElement, revertLocalEditFn, fetchClassesFn) {

    const courseId = courseElement.dataset.id; 
    
    if (!courseId) {
        console.error("Update failed: Course ID is missing.");
        return;
    }

    // ... (Data collection and validation logic remains the same) ...

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
        
        // 1. Use the passed function to revert the UI (disable edit mode)
        revertLocalEditFn(courseElement, apiData);;
        
        // 2. Use the passed function to refresh the data list
        fetchClassesFn(); 

    } catch (error) {
        console.error(`Failed to save changes for Course ID ${courseId}:`, error);
        alert("Failed to save course changes. Check console for details.");
    }
}

async function sendUpdateToAPI(courseId, classData) {
    const token = localStorage.getItem("token");
    

    const response = await fetch(`https://invaluably-grapier-jeni.ngrok-free.dev/classes/${courseId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(classData)
    });

    if (!response.ok) {
        const errorBody = await response.json(); 
        throw new Error(`API error ${response.status}: ${errorBody.message || response.statusText}`);
    }
}