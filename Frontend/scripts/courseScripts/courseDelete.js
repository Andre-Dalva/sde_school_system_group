// courseDelete.js

// API Handler for the DELETE request
async function sendDeleteToAPI(courseId) {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication failed: No token found.");
    
    const response = await fetch(`https://invaluably-grapier-jeni.ngrok-free.dev/classes/${courseId}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token,
            "ngrok-skip-browser-warning": "true"
        }
    });

    if (!response.ok) {
        let errorMessage = `HTTP Status ${response.status}: Failed to delete course.`;
        try {
             const errorBody = await response.json(); 
             errorMessage += ` Details: ${errorBody.message || response.statusText}`;
        } catch (e) {
            // Ignore JSON parsing errors for empty response bodies
        }
        throw new Error(errorMessage);
    }
}

// Main function to initiate deletion
export async function deleteCourse(courseElement) {
    const courseId = courseElement.dataset.id; 

    if (!courseId) {
        console.error("Deletion failed: Course ID is missing.");
        return;
    }

    if (!confirm(`Are you sure you want to permanently delete Course ID ${courseId}?`)) {
        return; 
    }

    try {
        await sendDeleteToAPI(courseId);

        // Remove the element from the DOM instantly on success
        courseElement.remove(); 
        
        console.log(`Course ID ${courseId} successfully deleted.`);

    } catch (error) {
        console.error(`Failed to delete Course ID ${courseId}:`, error);
        alert(`Failed to delete course ${courseId}. Check console for details.`);
    }
}