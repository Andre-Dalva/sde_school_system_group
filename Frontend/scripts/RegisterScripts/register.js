// =======================================================
// GLOBAL STATE
// =======================================================
let formData = {
    name: "",
    email: "",
    username: "",
    birthDate: "",
    password: "",
    role: "STUDENT"
};

// NGROK URL (change here if needed)
const API = "https://invaluably-grapier-jeni.ngrok-free.dev";

// =======================================================
// DEBUG LOG
// =======================================================
function log(...args) {
    console.log("%c[REGISTER DEBUG]", "color:#ff8800;font-weight:bold;", ...args);
}

// =======================================================
// STEP SWITCHER
// =======================================================
function showStep(step) {
    log("Switching to step:", step);

    switch (step) {
        case 1: renderStep1(); break;
        case 2: renderStep2(); break;
        case 3: renderStep3(); break;
    }
}

// -------------------------------------------------------

// =======================================================
// STEP 1 – BASIC INFO
// =======================================================
function renderStep1() {
    const form = document.getElementById("registerForm");
    form.innerHTML = `
        <h2 id="formTitle">Create an Account</h2>

        <div id="optionToRegister">
            <div class="oneOption">
                <h3 class="formLabel">Student</h3>
                <input type="radio" name="roleOption" id="roleStudent" checked>
            </div>

            <div class="oneOption">
                <h3 class="formLabel">Tutor</h3>
                <input type="radio" name="roleOption" id="roleTutor">
            </div>
        </div>

        <div class="formSection">
            <label>Full name:</label>
            <input type="text" id="fullName" class="formBox" value="${formData.name}">
        </div>

        <div class="formSection">
            <label>Email:</label>
            <input type="email" id="userEmail" class="formBox" value="${formData.email}">
        </div>

        <div class="formSection">
            <label>Username:</label>
            <input type="text" id="userName" class="formBox" value="${formData.username}">
        </div>

        <div class="formSection">
            <label>Birthdate:</label>
            <input type="date" id="userBirthdate" class="formBox" value="${formData.birthDate}">
        </div>

        <div class="formSection registerBlock">
            <button type="button" id="btnNext" class="formButton">
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    // Set radio button status from state
    document.getElementById("roleStudent").checked = (formData.role === "STUDENT");
    document.getElementById("roleTutor").checked = (formData.role === "TEACHER");

    document.getElementById("btnNext").onclick = () => {
        // Collect data
        formData.name = document.getElementById("fullName").value.trim();
        formData.email = document.getElementById("userEmail").value.trim();
        formData.username = document.getElementById("userName").value.trim();
        formData.birthDate = document.getElementById("userBirthdate").value;

        // Basic validation
        if (!formData.name || !formData.email || !formData.username || !formData.birthDate) {
            alert("Please fill in all basic information fields.");
            return;
        }

        formData.role = document.getElementById("roleTutor").checked
            ? "TEACHER"
            : "STUDENT";

        log("Collected Step 1:", formData);

        showStep(2);
    };
}

// -------------------------------------------------------

// =======================================================
// STEP 2 – PASSWORD
// =======================================================
function renderStep2() {
    const form = document.getElementById("registerForm");
    form.innerHTML = `
        <h2 id="formTitle">Create Password</h2>

        <div class="formSection">
            <label>Password:</label>
            <input type="password" id="userPassword" class="formBox" placeholder="min 8 characters">
        </div>

        <div class="formSection">
            <label>Repeat Password:</label>
            <input type="password" id="userPassword2" class="formBox">
            <p id="password-error" style="color: red; display: none; margin-top: 5px;">Passwords must match and be at least 8 characters long.</p>
        </div>

        <div class="formSection registerBlock">
            <button type="button" id="btnBack" class="formButton">
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <button type="button" id="btnNext" class="formButton">
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    const passwordError = document.getElementById("password-error");

    document.getElementById("btnBack").onclick = () => showStep(1);

    document.getElementById("btnNext").onclick = async () => {
        const pw1 = document.getElementById("userPassword").value;
        const pw2 = document.getElementById("userPassword2").value;
        
        // Validation Logic
        if (pw1.length < 8) {
            passwordError.innerText = "Password must be at least 8 characters long.";
            passwordError.style.display = 'block';
            return;
        }
        if (pw1 !== pw2) {
            passwordError.innerText = "Passwords do not match.";
            passwordError.style.display = 'block';
            return;
        }

        passwordError.style.display = 'none';
        formData.password = pw1;

        log("Collected Step 2:", formData);

        if (formData.role === "STUDENT") {
            // Student: register and done
            await submitStudent();
        } else {
            // Teacher: create teacher then show ID+code page
            await submitTeacher();
        }
    };
}

// -------------------------------------------------------

// =======================================================
// STEP 3 – TEACHER VERIFICATION (ID + CODE)
// =======================================================
function renderStep3() {
    const form = document.getElementById("registerForm");
    form.innerHTML = `
        <h2 id="formTitle">Tutor Verification</h2>

        <p style="margin: 0 0 1rem 0; text-align:center;">
            Your tutor account is pending activation. Please enter the<br>
            <strong>Tutor ID</strong> and <strong>8-digit verification code</strong> sent to your email.
        </p>

        <div class="formSection">
            <label>Tutor ID:</label>
            <input type="text" id="tutorId" class="formBox">
        </div>

        <div class="formSection">
            <label>8-digit Code:</label>
            <input type="text" id="teacherCode" class="formBox">
        </div>

        <div class="formSection registerBlock">
            <button type="button" id="btnBack" class="formButton">
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <button type="button" id="btnSubmit" class="formButton">
                Verify
            </button>
        </div>
    `;

    document.getElementById("btnBack").onclick = () => showStep(2);
    document.getElementById("btnSubmit").onclick = verifyTeacher;
}

// -------------------------------------------------------

// =======================================================
// API: STUDENT REGISTER
// =======================================================
async function submitStudent() {
    log("Submitting STUDENT:", formData);

    try {
        const response = await fetch(`${API}/users`, { // FIX: Added backticks
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
            // OPTIONAL: window.location.href = '/login.html';
        } else {
            const error = await response.json();
            alert(`Student registration failed: ${error.message || response.statusText}`);
        }
    } catch (err) {
        console.error("Student network error:", err);
        alert("Network error while registering student");
    }
}

// =======================================================
// API: TEACHER REGISTER (ONLY CREATION)
// =======================================================
async function submitTeacher() {
    log("Submitting TEACHER (create):", formData);

    try {
        const response = await fetch(`${API}/users`, { // FIX: Added backticks
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
            showStep(3);
        } else {
            const error = await response.json();
            alert(`Tutor creation failed: ${error.message || response.statusText}`);
        }
    } catch (err) {
        console.error("Teacher create network error:", err);
        alert("Network error while creating tutor account");
    }
}

// =======================================================
// API: TEACHER VERIFY (ID + CODE)
// =======================================================
async function verifyTeacher() {
    const tutorId = document.getElementById("tutorId").value.trim();
    const code = document.getElementById("teacherCode").value.trim();

    if (!tutorId || !code) {
        alert("Enter Tutor ID and verification code");
        return;
    }

    log("Verifying TEACHER with:", { tutorId, code });

    try {
        const resVerify = await fetch(
            `${API}/users/${encodeURIComponent(tutorId)}/verify?code=${encodeURIComponent(code)}`, // FIX: Added backticks
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
        } else {
            const error = await resVerify.json();
            alert(`Verification failed. Details: ${error.message || resVerify.statusText}`);
        }
    } catch (err) {
        console.error("Teacher verify network error:", err);
        alert("Network error while verifying tutor");
    }
}

// =======================================================
// INIT
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    showStep(1);
});