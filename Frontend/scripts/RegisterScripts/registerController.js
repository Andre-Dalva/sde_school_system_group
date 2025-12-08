import { renderStep1,renderStep2,renderStep3 } from "./registerFunctions";

let formData = {
    name: "",
    email: "",
    username: "",
    birthDate: "",
    password: "",
    role: "STUDENT"
};

export function showStep(step, formData) {
    log("Switching to step:", step);

    switch (step) {
        case 1: renderStep1(formData); break;
        case 2: renderStep2(formData); break;
        case 3: renderStep3(formData); break;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    showStep(1, formData);
});