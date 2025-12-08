import { log } from "../RegisterScripts/registerFunctions.js";
import { showStep } from "../RegisterScripts/registerController.js"; 

const API = "https://invaluably-grapier-jeni.ngrok-free.dev";

export async function submitStudent(formData) {
    log("Submitting STUDENT:", formData);

    try {
        const response = await fetch(`${API}/users`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({
                name: formData.name,
                username: formData.username,
                email: formData.email,
                birthDate: formData.birthDate,
                password: formData.password,
                role: "STUDENT"
            })
        });

        log("Student response:", response.status);

        if (response.ok) {
            alert("Student registered successfully! You can now log in.");
            window.location.href = '/login.html';
        } else {
            const error = await response.json();
            alert(`Student registration failed: ${error.message || response.statusText}`);
        }
    } catch (err) {
        console.error("Student network error:", err);
        alert("Network error while registering student");
    }
}

export async function submitTeacher(formData) {
    log("Submitting TEACHER (create):", formData);

    try {
        const response = await fetch(`${API}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({
                name: formData.name,
                username: formData.username,
                email: formData.email,
                birthDate: formData.birthDate,
                password: formData.password,
                role: "TEACHER"
            })
        });

        log("Teacher create response:", response.status);

        if (response.ok) {
            alert("Tutor account created. Please proceed to verification.");
            showStep(3,formData);
        } else {
            const error = await response.json();
            alert(`Tutor creation failed: ${error.message || response.statusText}`);
        }
    } catch (err) {
        console.error("Teacher create network error:", err);
        alert("Network error while creating tutor account");
    }
}

export async function verifyTeacher() {
    const tutorId = document.getElementById("tutorId").value.trim();
    const code = document.getElementById("teacherCode").value.trim();

    if (!tutorId || !code) {
        alert("Enter Tutor ID and verification code");
        return;
    }

    log("Verifying TEACHER with:", { tutorId, code });

    try {
        const resVerify = await fetch(
            `${API}/users/${tutorId}/verify?code=${code}`, // FIX: Added backticks
            {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "true"
                }
            }
        );

        log("Teacher verify response:", resVerify.status);

        if (resVerify.ok) {
            alert("Tutor verified successfully! You can now log in.");
            window.location.href = '/login.html';
        } else {
            const error = await resVerify.json();
            alert(`Verification failed. Details: ${error.message || resVerify.statusText}`);
        }
    } catch (err) {
        console.error("Teacher verify network error:", err);
        alert("Network error while verifying tutor");
    }
}