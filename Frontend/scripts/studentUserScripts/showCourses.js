let classesData = null;

function showClasses(classesData) {
    const container = document.getElementById("allCourses"); // 
    container.innerHTML = '';

    classesData.forEach((cls) => {
        const newCourseHTML = `
            <div class="course" data-id="${cls.id}">
                <div class="courseTitleContainer">
                        <h2 class="courseTitle">${cls.title}</h2>
                    <div class="edit"><i class="fa-solid fa-ellipsis" style="color: #000000;"></i></div>
                    <div class="editingOptions"><h4 class="editCourse">Edit</h4><h4 class="deleteCourse">Delete</h4></div>
                </div>
                <div class="courseDescription">
                    <p class="courseDetails">Classroom: <span class="classNumber">${cls.roomId}</span> <br> 
                        Tutor: <span class="tutorName">${cls.teacherName || 'Tutor ID Missing'}</span> </p>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newCourseHTML);
    });

    return true;
}

export async function fetchClasses() {
    const token = localStorage.getItem("token");
    const courseBody = document.getElementById("allCourses");

    if (!token) {
        console.error("Authentication required: No token found.");
        return;
    }

    try {
        const response = await fetch("https://invaluably-grapier-jeni.ngrok-free.dev/classes", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "ngrok-skip-browser-warning": "true"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`HTTP Status ${response.status}: Failed to fetch classes.`, errorData);
            return;
        }
        classesData = await response.json();

        console.log("Classes data received successfully (Status 200):", classesData);
        showClasses(classesData);
        return classesData;
    } catch (err) {
        console.error("Network or parsing error:", err);
    }
}
fetchClasses();