export function showClasses(classesData) {
    const container = document.getElementById("allCourses"); // 
    container.innerHTML = '';

    classesData.forEach((currentClass) => {
        const newCourseHTML = `
            <div class="course" data-id="${currentClass.id}">
                    <div class="edit">
                        <i class="fa-solid fa-ellipsis" style="color: #000000;"></i>
                    </div>

                    <div class="editingOptions">
                        <h4 class="editCourse">Edit</h4>
                        <h4 class="deleteCourse">Delete</h4>
                    </div>
                <div class="courseTitleContainer">
                        <h2 class="courseTitle">${currentClass.title.toUpperCase()}</h2>
                </div>
                <div class="courseDescription">
                    <p class="courseDetails">Classroom: <span class="classNumber">${currentClass.roomId}</span> <br> 
                        Tutor: <span class="tutorName">${currentClass.teacherName || 'Tutor ID Missing'}</span> </p>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newCourseHTML);
    });

    container.insertAdjacentHTML('beforeend', `
        <div class="course" id="newCourse">
            <div id="addSignBox">
                <i class="fa-solid fa-plus fa-2xl" style="color: #d4a391;" id="addSign"></i>
            </div>
        </div>
    `);

    return true;
}