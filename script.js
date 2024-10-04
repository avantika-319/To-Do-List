
const todoInput = document.getElementById('todoText');
const todoalert = document.getElementById('alert');
const listItems = document.getElementById('list-items');
const undo = document.getElementById('undo');
const archiveList = document.getElementById('archived');
const archiveBlock = document.getElementById('todo-archive');
const btnArchive = document.getElementById('toggle-archive');
const tag = document.getElementById('todoTag');
const deadlineInput = document.getElementById('todoDeadline');

let undoValue = '';
let tasks = [];
let archivedList = [];

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
    li.innerHTML = todovalue;
    
    const span = document.createElement("span");
    if (tagvalue !== '') {
        span.textContent = `${tagvalue}`;
        li.appendChild(span);
    }

    const deadlineSpan = document.createElement("span");
    if(deadlineValue !== '')
    {
        deadlineSpan.textContent =`${deadlineValue}`;
        deadlineSpan.style.color = 'red';
        li.appendChild(deadlineSpan);
    }

    const updButton = document.createElement("img");
    updButton.classList.add("update-btn");
    updButton.src = "images/pencil.png";
    updButton.addEventListener('click', (e) => {
        // updateTask(e, todovalue, tagvalue, deadlineValue)
        updateTask(e,taskObject);
    });
    li.appendChild(updButton);

    const delButton = document.createElement("img");
    delButton.classList.add("del-button");
    delButton.src = "images/delete.png";
    delButton.addEventListener('click', (e) => {
        // li.removeChild(span);
        // li.removeChild(updButton);
        deleteTask(e, taskObject);
    });
    li.appendChild(delButton);

    listItems.appendChild(li);
    // tasks.push(todovalue);
    tasks.push(taskObject);

    todoInput.value = "";
    tag.value = "";
    deadlineInput.value ="";

}

function deleteTask(e, taskObject) {
    const li = e.target.parentElement;
    const text = li.firstChild.textContent;
    if (confirm("Are you sure you want to delete")) {
        // archivedList.push(text);
        archivedList.push(taskObject);
        renderArchive();
        undoValue = text;
        tasks = tasks.filter(task => task.task !== text)
        li.remove();
        todoalert.innerText = "";
    } else {
        todoalert.innerText = "NOT DELETED";
    }
}

// function updateTask(e, oldValue, oldTagValue, oldDeadline) {
//     // Populate the input fields with the current task's values
//     todoInput.value = oldValue;
//     tag.value = oldTagValue;
//     deadlineInput.value = oldDeadline;

//     const li = e.target.parentElement;
//     li.remove();
//     tasks = tasks.filter(task => task !== oldValue);
// }

function updateTask(e, taskObject) {
    // Populate the input fields with the current task's values
    todoInput.value = taskObject.task;
    tag.value = taskObject.tag;
    deadlineInput.value = taskObject.deadline;

    const li = e.target.parentElement;
    li.remove();
    tasks = tasks.filter(task => task.task !== taskObject.task);
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
        }
        undoValue = "";
    });
}

function renderArchive() {
    archiveList.innerHTML = "";
    archivedList.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = task.task;
        archiveList.appendChild(li);
    });
}

function ToggleArchive() {
    archiveBlock.classList.toggle('hidden');
}

btnArchive.addEventListener('click', ToggleArchive);
