const loginButton = document.getElementById("loginButtonForm");
function decodeJwtPayload(token) {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payloadBase64 = parts[1];
    
    let base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    switch (base64.length % 4) {
        case 0: break;
        case 2: base64 += '=='; break;
        case 3: base64 += '='; break;
    }

    try {
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT payload:", e);
        return null;
    }
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const identifier = document.getElementById("emailBox").value;
    const password = document.getElementById("passwordBox").value;


    const loginData = {
        identifier: identifier,
        password: password
    };

    const oldError = document.querySelector(".errorMessage");
    if (oldError) oldError.remove();

    try {
        const response = await fetch("https://sde-school-system-group.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            const myH4 = document.createElement("h4");
            myH4.innerText = "Your credentials are not correct!!";
            myH4.classList.add("errorMessage");
            myH4.style.color = "red";

            document.getElementById("loginForm").insertBefore(myH4,loginButton);
            return;
        }

        console.log("Log in processed");
        const token = await response.text();

        // If backend returns JWT token:
        localStorage.setItem("token",token);
        const payload = decodeJwtPayload(token);
        const userRole = payload ? payload.role : 'Student';

        if (userRole === 'ADMIN') {
            window.location.href = "../htmlLoggedProfessor/index-tutor.html";
        } else if (userRole === 'TEACHER') {
            console.log("teacher")
            window.location.href = "../htmlLoggedProfessor/index-tutor.html";
        } else if (userRole === 'STUDENT') {
            console.log("student")
            window.location.href = "../htmlLoggedStudent/index-student.html";
        } else {
            window.location.href = "../index.html";
            console.log("failed")
        }

    } catch (error) {
        console.error("Error connecting to backend:", error);
    }
});
