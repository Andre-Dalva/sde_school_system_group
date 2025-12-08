const token = localStorage.getItem("token");
fetch("https://invaluably-grapier-jeni.ngrok-free.dev/users/me", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + token,
        "ngrok-skip-browser-warning": "true"
    }
}).then(response => response.json()).then(data => {
    console.log(data)
    const welcomeUser = document.getElementById("helloUsername");
    welcomeUser.innerText = data.name;
}).catch(err => console.log(err))