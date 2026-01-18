const API_BASE_URL = "https://invaluably-grapier-jeni.ngrok-free.dev";

export async function updateUser(updateData) {

    if (Object.keys(updateData).length === 0) {
        console.warn("Update failed: No data provided for modification.");
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            let errorMessage = `Update failed with status: ${response.status}.`;
            try {
                const errorData = await response.json();
                errorMessage += ` Details: ${errorData.message || response.statusText}`;
            } catch (e) { }
            throw new Error(errorMessage);
        }

        const updatedUserData = await response.json();

        console.log("User updated successfully:", updatedUserData);
        alert("Profile updated successfully!");

        return updatedUserData;

    } catch (error) {
        console.error("Profile update error:", error.message);
        alert(`Profile update failed: ${error.message}`);
        return null;
    }
}

export async function deleteAccount(password) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({ password: password })
        });

        if (!response.ok) {
            let errorData = {};
            
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                try {
                    errorData = await response.json();
                } catch (e) {
                    console.warn(`Server status ${response.status} failed to parse as JSON. Body may be empty.`);
                }
            }
            
            const errorMessage = errorData.message || `Deletion failed. Status: ${response.status}. Check your password.`;
            throw new Error(errorMessage);
        }

        localStorage.removeItem("token");
        alert("Account successfully deleted. You will now be redirected.");
        window.location.href = "../index.html";

        return true;

    } catch (error) {
        console.error("Account deletion error:", error.message);
        throw error;
    }
}