const mainContent = document.getElementById("main-content");
let isProjectSelected = false;
let projectCounter = 0;
const formTemplate = `
<div class="row justify-content-end mx-5 px-5">
    <button id="cancel-btn" class="col-2 simple-btn">Cancel</button>
    <button id="save-btn" class="col-2">Save</button>
</div>
<form class="mx-5 p-5 text-start">
    <div class="form-group">
        <label for="title">TITLE</label>
        <input type="text" class="form-control mb-3" id="title" placeholder="Project Title">
    </div>
    <div class="form-group">
        <label for="description">DESCRIPTION</label>
        <input type="text" class="form-control mb-3" id="description" placeholder="Description of the project">
    </div>
    <div class="form-group">
        <label for="duedate">DUE DATE</label>
        <input type="date" class="form-control mb-3" id="duedate">
    </div>
</form>
`;

const allProjectList = document.getElementById("all-projects");

const noProjectTemplate = `
<img src="assets/no-projects.png" alt="notepad"/>
<h4 class="m-3">No Project Selected</h4>
<p>Select a project or get started with a new one</p>
<button class="add-project">Create Project</button>
`;

let projects = [];
function deleteTask(tasks) {
    const deleteBtns = document.querySelectorAll(".delete-task");
    deleteBtns.forEach((deleteBtn, index) => {
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            showTask(tasks);  // Re-render the tasks
        });
    });
}

function showTask(tasks) {
    const taskArea = document.getElementById("allTask");
    taskArea.innerHTML = '';  // Clear previous task list

    tasks.forEach((task, index) => {
        taskArea.innerHTML += `
        <div class="task-item row align-items-center">
            <p class="col-9" data-taskId="${index}">${task}</p>
            <button class="simple-btn col-3 delete-task" data-taskId="${index}">Delete</button>
        </div>
        `;
    });

    deleteTask(tasks);  // Attach delete event listeners
}

function singleProjectDisplay(oneProject){
    mainContent.innerHTML=`
            <div class="text-start row mx-5 justify-content-between">
            <h4 class="col-8 ">${oneProject.title.toUpperCase()}</h4>
            <button class="col-3 simple-btn">Delete</button>
            <p class="col-12 fw-lighter">${oneProject.dueDate}</p>
            <p class="col-12">${oneProject.description}</p>
            <hr id="styled-hr">
            <h4 class="col-12">Tasks</h4>
            <div>
            <input id="task-input" class="col-6" type="text">
            <button id="addTask" class="col-3 simple-btn">Add Task</button>
            </div>
            <div id="allTask" class="row">
            
            </div>
</div>
`;
    showTask(oneProject.tasks);
    isProjectSelected=true;
    const taskBtn = document.getElementById("addTask");
    taskBtn.addEventListener("click", () => {
        const inpt = document.getElementById('task-input');
        const taskValue = inpt.value;
        if (taskValue) { // Add a check to prevent adding empty tasks
            oneProject.tasks.push(taskValue);
            inpt.value = ''; // Clear the input field
            showTask(oneProject.tasks);
        }
    });
}
function addEventToTiles() {
    const h6 = document.querySelectorAll('.btn-h');
    const closeBtn = document.querySelectorAll('.close-x');

    h6.forEach(btn => {
        btn.addEventListener('click', () => {
            let id = btn.getAttribute('data-projectID');

           let oneProject=projects.find(project => project.id == id);
            singleProjectDisplay(oneProject);
        });
    });

    closeBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            let id = btn.getAttribute('data-projectID');
            projects = projects.filter(project => project.id !== parseInt(id)); // Fix: return filtered projects array
            displayProjectList();
            renderNoProjectTemplate()
        });
    });
}

function renderNoProjectTemplate() {
    mainContent.innerHTML = '';
    mainContent.innerHTML = noProjectTemplate;
    addEventListenersToButtons();
}

function displayProjectList() {
    allProjectList.innerHTML = ''; // Fix: Remove the space in the innerHTML assignment
    let counter = 0;

    projects.forEach((project) => {
        let checkClass = counter % 2 === 0 ? 'even' : 'odd';
        allProjectList.innerHTML += `
        <div class="styled-list row justify-content-between ${checkClass} p-3 m-3 align-item-center">
            <h6 class="tiles col-10 py-1 mb-0 align-self-center btn-h" id="btn-${project.id}" data-projectID="${project.id}">${project.title}</h6>
            <span class="col-2 text-center py-1 close-x" data-projectID="${project.id}">x</span>   
        </div>
        `;
        counter++;
    });

    addEventToTiles();
}

function addEventListenersToButtons() {
    const addProjectButtons = document.querySelectorAll(".add-project");
    addProjectButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            mainContent.innerHTML = '';
            mainContent.innerHTML = formTemplate;
            isProjectSelected = true;
            addEventListenersToForm();
        });
    });
}

const modalWindow = `
<div class="row justify-content-center"> 
<div class="m-5 p-5 col-6" id="myModal">
<p class="text-center">Project Saved Successfully</p>
<button id="close-modal">close</button>
</div>
</div>
`;

function modalClose() {
    const closeBtn = document.getElementById("close-modal");
    closeBtn.addEventListener('click', () => {
        renderNoProjectTemplate();
        console.log(projects);
    });
}

function showModal() {
    mainContent.innerHTML = modalWindow;
    isProjectSelected = false;
    modalClose();
}

function addEventListenersToForm() {
    const cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', () => {
        renderNoProjectTemplate();
        isProjectSelected = false;
    });

    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDateValue = document.getElementById('duedate').value;

        // Convert due date to a Date object
        const dueDate = new Date(dueDateValue);

        // Convert to string (you can choose your desired format)
        const dueDateString = dueDate.toISOString().split('T')[0]; // Example: "YYYY-MM-DD"

        const oneProject = {
            id: projectCounter,
            title: title,
            description: description,
            dueDate: dueDateString,
            tasks:[]
        };

        projectCounter++;
        projects.push(oneProject);
        displayProjectList();
        showModal();
    });
}

if (!isProjectSelected) {
    renderNoProjectTemplate();
}
