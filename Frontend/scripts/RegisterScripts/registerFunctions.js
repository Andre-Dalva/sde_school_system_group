import { submitStudent, submitTeacher, verifyTeacher } from "../API/registerAPI.js";
import { showStep } from "../RegisterScripts/registerController.js";

export function log(...args) {
    console.log("%c[REGISTER DEBUG]", "color:#ff8800;font-weight:bold;", ...args);
}

export function renderStep1(formData) {
    const form = document.getElementById("registerForm");
    form.innerHTML = `
        <h2 id="form-title">Create an Account</h2>

        <p id="information-error" style="text-align: center; color: red; display: none; margin-top: 5px;"> Please fill in all basic information fields. </p>

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

        <div class="form-section">
            <label>Full name:</label>
            <input type="text" id="fullName" placeholder="type your full name..." class="form-box" value="${formData.name}">
        </div>

        <div class="form-section">
            <label>Email:</label>
            <input type="email" id="userEmail" placeholder="type your email..." class="form-box" value="${formData.email}">
        </div>

        <div class="form-section">
            <label>Username:</label>
            <input type="text" id="userName" placeholder="type your username..." class="form-box" value="${formData.username}">
        </div>

        <div class="form-section">
            <label>Birthdate:</label>
            <input type="date" id="userBirthdate" class="form-box" value="${formData.birthDate}">
        </div>

        <div class="form-section register-block">
            <button type="button" id="btnNext" class="form-button">
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

        const informationError = document.getElementById("information-error");

        if (!formData.name || !formData.email || !formData.username || !formData.birthDate) {
            informationError.style.display = "block";
            return;
        }

        informationError.style.display = "none";

        formData.role = document.getElementById("roleTutor").checked? "TEACHER": "STUDENT";

        showStep(2, formData);
    };
}

export function renderStep2(formData) {
    const form = document.getElementById("registerForm");
    form.innerHTML = `
        <h2 id="form-title">Create Password</h2>

        <div class="form-section">
            <label>Password:</label>
            <input type="password" id="userPassword" class="form-box" placeholder="(min 8 characters)">
        </div>

        <div class="form-section">
            <label>Repeat Password:</label>
            <input type="password" id="userPassword2" class="form-box" placeholder="...">
            <p id="password-error" style="color: red; display: none; margin-top: 5px;">Passwords must match and be at least 8 characters long.</p>
        </div>

        <div class="form-section register-block">
            <button type="button" id="btnBack" class="form-button">
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <button type="button" id="btnNext" class="form-button">
                SUBMIT
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
        <h2 id="form-title">Tutor Verification</h2>
        <p style="margin: 0 0 1rem 0; text-align:center;">
            Your tutor account is pending activation. Please enter the<br>
            <strong>Tutor ID</strong> and <strong>8-digit verification code</strong> sent to your email.
        </p>

        <div class="form-section">
            <label>Tutor ID:</label>
            <input type="text" id="tutorId" class="form-box">
        </div>

        <div class="formSection">
            <label>8-digit Code:</label>
            <input type="text" id="teacherCode" class="form-box">
        </div>

        <div class="formSection register-block">
            <button type="button" id="btnBack" class="form-button">
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <button type="button" id="btnSubmit" class="form-button">
                Verify
            </button>
        </div>
    `;

    document.getElementById("btnBack").onclick = () => showStep(2,formData);
    document.getElementById("btnSubmit").onclick = verifyTeacher;
}