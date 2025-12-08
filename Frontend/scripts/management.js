let classesData = null;
let enrolledStudents = null

function showClasses(classesData) {
    const container = document.getElementById("studentsTable");
    container.innerHTML = ``;
    classesData.forEach( async(cls) => {
        await fetchStudents(cls.id);
        const tableContent = `
        <thead>
                <tr><th class="courseName">${cls.title}</th></tr>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Birthdate</th>
                </tr>
        </thead>
        <tbody>
                <tr>
                    <td>Undefined</td>
                    <td>null@gmail.com</td>
                    <td>nothing</td>
                    <td>2001-09-11</td>
                </tr>
        </tbody>
    `
    container.insertAdjacentHTML('beforeend', tableContent)
    });

    return true;
}

async function fetchClasses() {
    const token = localStorage.getItem("token");

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

async function fetchStudents(classId) {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Authentication required: No token found.");
        return;
    }

    try {
        const response = await fetch(`https://invaluably-grapier-jeni.ngrok-free.dev/classes/${classId}/students`, {
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
        enrolledStudents = await response.json();

        console.log("enrolled students", enrolledStudents);
        return enrolledStudents;
    } catch (err) {
        console.error("Network or parsing error:", err);
    }
}
fetchClasses();