
const todoInput = document.getElementById('todoText');
const todoalert = document.getElementById('alert');
const listItems = document.getElementById('list-items');
const undo = document.getElementById('undo');
let undoValue = '';

function CreateItem() {
    const todovalue = todoInput.value;
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
    listItems.appendChild(li);

    todoInput.value = "";

}

listItems.addEventListener('click', (e) => {
    //console.log(e.target);
    if (e.target.tagName === 'LI') {
        e.stopPropagation();
        //e.target.classList.toggle("checked");
        undoValue = e.target.textContent;
        e.target.remove();
    }
});

function UndoItem() {
    undo.addEventListener('click', (e) => {
        if (undoValue != "") {
            const li = document.createElement("li");
            li.innerHTML = undoValue;
            listItems.appendChild(li);
        }
        undoValue = "";
    });
}
