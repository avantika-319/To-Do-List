
const todoInput = document.getElementById('todoText');
const todoalert = document.getElementById('alert');
const listItems = document.getElementById('list-items');
const undo = document.getElementById('undo');
const archiveList = document.getElementById('archived');
const archiveBlock = document.getElementById('todo-archive');
const btnArchive= document.getElementById('toggle-archive');
const tag = document.getElementById('todoTag');


let undoValue = '';
let tasks=[];
let archivedList=[];

function CreateItem() {
    const todovalue = todoInput.value;
    const tagvalue= tag.value;
    //console.log(todovalue);


    if (todovalue.trim() === "") {
        todoalert.innerText = "please enter into your to do list";
        //console.log(todoalert);
        return
    }

    todoalert.innerHTML = "";
    const li = document.createElement("li");
    // const itemstodo = `${todovalue}`;
    li.innerHTML = todovalue;
    const span = document.createElement("span");

    if(tagvalue !==''){
        span.textContent = `${tagvalue}`;
        li.appendChild(span);
    }

    li.addEventListener('click',(e)=>{
        li.removeChild(span);
        deleteTask(e);
    })

    listItems.appendChild(li);
    tasks.push(todovalue);

    todoInput.value = "";
    tag.value ="";

}

function deleteTask(e){
    const text = e.target.textContent;
        // archivedList.push(text);
        // renderArchive();

        // // undoValue = text;
        // // tasks = tasks.filter(task => task !== text)
        // // e.target.remove();
        if (confirm("Are you sure you want to delete")) {
            archivedList.push(text);
            renderArchive();
            undoValue = text;
            tasks = tasks.filter(task => task !== text)
            e.target.remove();
            todoalert.innerText = "";
        } else {
            todoalert.innerText = "NOT DELETED";
        }
}


function UndoItem() {
    undo.addEventListener('click', (e) => {
        if (undoValue != "") {
            const li = document.createElement("li");
            li.innerHTML = undoValue;

            li.addEventListener('click',(e)=>{
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

function renderArchive(){
    archiveList.innerHTML="";
    archivedList.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML=task;
        archiveList.appendChild(li);
    });
}

function ToggleArchive(){
    archiveBlock.classList.toggle('hidden');
}

btnArchive.addEventListener('click', ToggleArchive);
