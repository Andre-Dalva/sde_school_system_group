import {showClasses} from '../courseScripts/courseRead.js';

const API_BASE_URL = "https://invaluably-grapier-jeni.ngrok-free.dev";
const API_CLASSES_URL = `${API_BASE_URL}/classes`;

function getToken() {
    return localStorage.getItem("token");
}

function createHeaders(contentType = 'application/json') {
    const token = getToken();
    const headers = {
        "Authorization": "Bearer " + token,
        "ngrok-skip-browser-warning": "true"
    };
    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    return headers;
}

// 1. CREATE CLASS
export async function createNewClass(classData) {
    try {
        const response = await fetch(API_CLASSES_URL, {
            method: "POST",
            headers: createHeaders(),
            body: JSON.stringify(classData)
        });

        if (response.ok) {
            const newClass = await response.json();
            console.log("✅ Created:", newClass.title);
            return newClass;
        } else {
            const errorBody = await response.text();
            let errorMessage = `❌ Failed: Status ${response.status}`;
            
            try {
                const errorJson = JSON.parse(errorBody);
                errorMessage += `: ${errorJson.message || response.statusText}`;
            } catch (e) {
                errorMessage += `. Details: ${errorBody.substring(0, 100)}`; 
            }
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Network error:", error);
        throw error;
    }
}

// 2. FETCH CLASSES (READ ALL)
export async function fetchClasses(startToCreate) {

    const courseBody = document.getElementById("allCourses");

    try {
        const response = await fetch(API_CLASSES_URL, {
            method: "GET",
            headers: createHeaders(null)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP Status ${response.status}: Failed to fetch classes.`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage += ` Details: ${errorData.message || response.statusText}`;
            } catch (e) {}

            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        
        const classesData = await response.json(); 

        showClasses(classesData);

        const addBox = document.getElementById("newCourse");
        const addSign = document.getElementById("addSign");

        if (addSign && addBox) {
            addSign.addEventListener("click", () => startToCreate(courseBody, addBox));
        }

        return classesData;
    } catch (err) {
        console.error("Network or parsing error:", err);
        throw err;
    }
}

// 3. UPDATE CLASS
export async function sendUpdateToAPI(courseId, classData) {
    try {
        const response = await fetch(`${API_CLASSES_URL}/${courseId}`, {
            method: "PUT",
            headers: createHeaders(),
            body: JSON.stringify(classData)
        });

        if (!response.ok) {
            let errorText = await response.text();
            let errorMessage = `API error ${response.status}: Failed to update class.`;

            try {
                const errorBody = JSON.parse(errorText); 
                errorMessage = `API error ${response.status}: ${errorBody.message || response.statusText}`;
            } catch (e) {
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Update error:", error);
        throw error;
    }
}

// 4. DELETE CLASS
export async function sendDeleteToAPI(courseId) {

    try {
        const response = await fetch(`${API_CLASSES_URL}/${courseId}`, {
            method: "DELETE",
            headers: createHeaders(null)
        });

        if (!response.ok) {
            let errorText = await response.text();
            let errorMessage = `HTTP Status ${response.status}: Failed to delete course.`;
            
            try {
                 const errorBody = JSON.parse(errorText); 
                 errorMessage += ` Details: ${errorBody.message || response.statusText}`;
            } catch (e) {
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Deletion error:", error);
        throw error;
    }
}