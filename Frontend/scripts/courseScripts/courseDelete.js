import {sendDeleteToAPI} from '../API/coursesAPI.js';

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

        courseElement.remove(); 
        
        console.log(`Course ID ${courseId} successfully deleted.`);

    } catch (error) {
        console.error(`Failed to delete Course ID ${courseId}:`, error);
        alert(`Failed to delete course ${courseId}. Check console for details.`);
    }
}