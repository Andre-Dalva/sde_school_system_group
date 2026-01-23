const token = localStorage.getItem("token");

fetch("https://sde-school-system-group.onrender.com/users/me", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + token,
        "ngrok-skip-browser-warning": "true"
    }
})
.then(response => response.json()) 
.then(userData => {
    displayInfo(userData); 
})
.catch(err => {
    console.error("Failed to fetch user data:", err);
});

function displayInfo(userData){
    document.getElementById("displayFullName").innerText = userData.name;
    document.getElementById("displayUsername").innerText = userData.username
    document.getElementById("displayEmail").innerText = userData.email
    document.getElementById("displayBirth").innerText = userData.birthDate;
    document.getElementById("displayRole").innerText = userData.role;
    const fullName = [userData.name.split(" ")];
    document.getElementById("helloUser").innerText = fullName[0];
}
