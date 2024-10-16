
const todoInput = document.getElementById('todoText');
const todoalert = document.getElementById('alert');
const listItems = document.getElementById('list-items');
const undo = document.getElementById('undo');
const archiveList = document.getElementById('archived');
const archiveBlock = document.getElementById('todo-archive');
const btnArchive = document.getElementById('toggle-archive');
const tag = document.getElementById('todoTag');
const deadlineInput = document.getElementById('todoDeadline');

const reminderSound = new Audio('notification.wav')

let undoValue = '';
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let archivedList = JSON.parse(localStorage.getItem('archivedTasks')) ||[];

function saveTaskToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('archivedTasks', JSON.stringify(archivedList));
}

function renderLocalStorageTasks(){
    tasks.forEach(taskObject => {
        const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type="checkbox";
    checkbox.name="task";
    checkbox.value = taskObject.task;
    checkbox.addEventListener('change', () => {
        // Mark task as completed
        if (checkbox.checked) {
            li.style.textDecoration = "line-through"; 
            li.style.color = "gray"; 
        } else {
            li.style.textDecoration = "none"; 
            li.style.color = "black";
        }
    });
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(taskObject.task));
    
    const span = document.createElement("span");
    if (taskObject.tag !== '') {
        span.textContent = `${taskObject.tag}`;
        li.appendChild(span);
    }

    const deadlineSpan = document.createElement("span");
    if(taskObject.deadline !== '')
    {
        deadlineSpan.textContent =`${taskObject.deadline}`;
        deadlineSpan.style.color = 'green';
        li.appendChild(deadlineSpan);

        setReminder(taskObject.deadline,taskObject.task, deadlineSpan)
    }

    const updButton = document.createElement("img");
    updButton.classList.add("update-btn");
    updButton.src = "images/pencil.png";
    updButton.addEventListener('click', (e) => {
        updateTask(e,taskObject);
    });
    li.appendChild(updButton);

    const delButton = document.createElement("img");
    delButton.classList.add("del-button");
    delButton.src = "images/delete.png";
    delButton.addEventListener('click', (e) => {
        deleteTask(e, taskObject);
    });
    li.appendChild(delButton);

    listItems.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () =>{
    renderLocalStorageTasks();
    renderArchive();
});


function CreateItem() {
    const todovalue = todoInput.value;
    const tagvalue = tag.value;
    const deadlineValue = deadlineInput.value;


    if (todovalue.trim() === "") {
        todoalert.innerText = "please enter into your to do list";
        return
    }

    todoalert.innerHTML = "";

    const taskObject= {
        task: todovalue,
        tag: tagvalue,
        deadline: deadlineValue
    }

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type="checkbox";
    checkbox.name="task";
    checkbox.value = todovalue;
    checkbox.addEventListener('change', () => {
        // Mark task as completed
        if (checkbox.checked) {
            li.style.textDecoration = "line-through"; 
            li.style.color = "gray"; 
        } else {
            li.style.textDecoration = "none"; 
            li.style.color = "black";
        }
    });
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(todovalue));
    
    const span = document.createElement("span");
    if (tagvalue !== '') {
        span.textContent = `${tagvalue}`;
        li.appendChild(span);
    }

    const deadlineSpan = document.createElement("span");
    if(deadlineValue !== '')
    {
        deadlineSpan.textContent =`${deadlineValue}`;
        deadlineSpan.style.color = 'green';
        li.appendChild(deadlineSpan);

        setReminder(deadlineValue,taskObject.task, deadlineSpan)
    }

    const updButton = document.createElement("img");
    updButton.classList.add("update-btn");
    updButton.src = "images/pencil.png";
    updButton.addEventListener('click', (e) => {
        updateTask(e,taskObject);
    });
    li.appendChild(updButton);

    const delButton = document.createElement("img");
    delButton.classList.add("del-button");
    delButton.src = "images/delete.png";
    delButton.addEventListener('click', (e) => {
        deleteTask(e, taskObject);
    });
    li.appendChild(delButton);

    listItems.appendChild(li);
    tasks.push(taskObject);

    todoInput.value = "";
    tag.value = "";
    deadlineInput.value ="";

    saveTaskToLocalStorage();

}

function deleteTask(e, taskObject) {
    const li = e.target.parentElement;
    const text = li.firstChild.nextSibling.textContent;
    if (confirm("Are you sure you want to delete")) {
        // archivedList.push(text);
        archivedList.push(taskObject);
        renderArchive();
        undoValue = text;
        tasks = tasks.filter(task => task.task !== text)
        li.remove();
        saveTaskToLocalStorage();
        todoalert.innerText = "";
    } else {
        todoalert.innerText = "NOT DELETED";
    }
}

function updateTask(e, taskObject) {
    // Populate the input fields with the current task's values
    todoInput.value = taskObject.task;
    tag.value = taskObject.tag;
    deadlineInput.value = taskObject.deadline;

    const li = e.target.parentElement;
    li.remove();
    tasks = tasks.filter(task => task.task !== taskObject.task);

    saveTaskToLocalStorage();
}

function UndoItem() {
    undo.addEventListener('click', (e) => {
        if (undoValue != "") {
            const li = document.createElement("li");
            li.innerHTML = undoValue;

            li.addEventListener('click', (e) => {
                deleteTask(e);
            })

            listItems.appendChild(li);
            tasks.push(undoValue);
            archivedList = archivedList.filter(archive => archive != undoValue)
            renderArchive();
            saveTaskToLocalStorage();
        }
        undoValue = "";
    });
}

function setReminder(deadline, taskName, deadlineSpan){
    const currentTime = new Date();
    const deadlineTime =new Date(deadline);

    deadlineTime.setHours(9,0,0,0);

    if(deadlineTime > currentTime){
        const timeDifference = deadlineTime-currentTime;

        setTimeout(()=>{
            reminderSound.play();
            setTimeout(() => {
                alert(`Reminder: It's time to work on "${taskName}"!`);
            }, 500);
            deadlineSpan.style.color='red';

            setTimeout(()=>{
                reminderSound.pause();
                reminderSound.currentTime=0;
            },10000);
        },timeDifference);

    }
}

function renderArchive() {
    archiveList.innerHTML = "";
    archivedList.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = task.task;
        archiveList.appendChild(li);

        const delButton = document.createElement("img");
        delButton.classList.add("del-button");
        delButton.src = "images/delete.png";
        delButton.addEventListener('click', (e) => {
            li.remove();
            archivedList = archivedList.filter(archivedTask => archivedTask.task !== task.task);
            saveTaskToLocalStorage();
        });
        li.appendChild(delButton);
    });
    saveTaskToLocalStorage();
}

function ToggleArchive() {
    archiveBlock.classList.toggle('hidden');
}

btnArchive.addEventListener('click', ToggleArchive);
