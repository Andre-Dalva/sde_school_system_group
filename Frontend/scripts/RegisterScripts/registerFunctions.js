import { submitStudent, submitTeacher, verifyTeacher } from "../API/registerAPI.js";

export function log(...args) {
    console.log("%c[REGISTER DEBUG]", "color:#ff8800;font-weight:bold;", ...args);
}

export function renderStep1(formData) {
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
            <input type="text" id="fullName" placeholder="type your full name..." class="formBox" value="${formData.name}">
        </div>

        <div class="formSection">
            <label>Email:</label>
            <input type="email" id="userEmail" placeholder="type your email..." class="formBox" value="${formData.email}">
        </div>

        <div class="formSection">
            <label>Username:</label>
            <input type="text" id="userName" placeholder="type your username..." class="formBox" value="${formData.username}">
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

    document.getElementById("roleStudent").checked = (formData.role === "STUDENT");
    document.getElementById("roleTutor").checked = (formData.role === "TEACHER");

    document.getElementById("btnNext").onclick = () => {
        
        formData.name = document.getElementById("fullName").value.trim();
        formData.email = document.getElementById("userEmail").value.trim();
        formData.username = document.getElementById("userName").value.trim();
        formData.birthDate = document.getElementById("userBirthdate").value;

        if (!formData.name || !formData.email || !formData.username || !formData.birthDate) {
            alert("Please fill in all basic information fields.");
            return;
        }

        formData.role = document.getElementById("roleTutor").checked? "TEACHER": "STUDENT";

        log("Collected Step 1:", formData);

        showStep(2, formData);
    };
}

export function renderStep2(formData) {
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

    document.getElementById("btnBack").onclick = () => showStep(1, formData);

    document.getElementById("btnNext").onclick = async () => {
        const pw1 = document.getElementById("userPassword").value;
        const pw2 = document.getElementById("userPassword2").value;
        
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
            await submitStudent(formData);
        } else {
            await submitTeacher(formData);
        }
    };
}
export function renderStep3(formData) {
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

    document.getElementById("btnBack").onclick = () => showStep(2,formData);
    document.getElementById("btnSubmit").onclick = verifyTeacher;
}