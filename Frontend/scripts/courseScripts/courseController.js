import { fetchClasses } from "../API/coursesAPI.js";
import { startToCreate } from "./courseCreate.js";
import { editing } from "./courseUpdate.js"; 

// 1. Initial setup for fetching and rendering the course list
// This also sets up the "Add Course" click handler inside fetchClasses
fetchClasses(startToCreate); 

// --- FIX/BEST PRACTICE: Ensure DOM is loaded before accessing elements ---
document.addEventListener("DOMContentLoaded", () => {
    
    const editingSetter = document.getElementById("editingSetter");

    // Check if the element exists before attaching the listener
    if (editingSetter) {
        editingSetter.onclick = () => {
            // 2. We defer selecting the 'edit' elements until the button is clicked.
            // This guarantees the elements exist IF showClasses has finished rendering.
            const editElements = Array.from(document.getElementsByClassName("edit"));
            editing(editElements);
        };
    } else {
        console.error("Error: Element with ID 'editingSetter' was not found in the DOM.");
    }
});