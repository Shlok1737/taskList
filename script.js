let btn = document.querySelector('#addBtn');
let ul = document.querySelector('#taskList');
let input = document.querySelector('#input');


// let tasks = [all the previous values that got stored inside task] || empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach( function(TASKVALUE) {
  addTask(TASKVALUE);
}
);



function saveTasks() {
  let allTasks = [];  

  //SEARCH FOR THIS ID #taskList
  // INSIDE IT SEARCH FOR EVERY li tag
  // THEN GRAB EVERY span tag INSIDE EVERY li
  //FOR EACH SPAN TAG, TAKE THE TEXT INSIDE IT AND STORE IT IN allTasks 
  document.querySelectorAll('#taskList li span').forEach(span => {
    allTasks.push(span.textContent);
  });
  

  // MAKE NEW KEY tasks
  //CONVERT allTasks ARRAY TO A STRING
  // STORE THE STRING VALUE INSIDE THE KEY
  //LOCALSTORAGE WILL KEEP EVERYTHING STORED ONLINE SO U CAN REFRESH BEFIKAR
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  
}


function addTask(taskValue) {
      let li = document.createElement('li');
      let span = document.createElement('span');
      span.textContent = taskValue;

      let editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className='edit';

      editBtn.addEventListener('click', function () {

       let editInput = document.createElement('textarea');
        editInput.rows = 3;
        editInput.value = span.textContent;

        let saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';

        li.replaceChild(editInput, span);
        li.replaceChild(saveBtn, editBtn);

        
        saveBtn.addEventListener('click', function () {
          span.textContent = editInput.value;     
          li.replaceChild(span, editInput);
          li.replaceChild(editBtn, saveBtn);
          saveTasks();

              if (!editInput.value) {
              li.remove();
              saveTasks();              
            } 
        });
      });

      let del = document.createElement('button');
      del.textContent = 'Delete';
      del.className ='del';
       del.addEventListener('click', function () {
        li.remove();
        saveTasks();
      
      });
      
      ul.appendChild(li);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(del);

      addDnDHandlers(li); 

      input.value = '';
}

if (btn) { 
  btn.addEventListener('click', function () {

    if (!input.value) {
     alert("Write a task.");
    } 
    
   else{
     addTask(input.value);
     saveTasks();
     input.value = '';
    } 

  });
}






let elementBeingDragged = null;

function handleDragStart(e) {
  elementBeingDragged = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);
  this.classList.add('dragging'); //for css styling only
}

function handleDragOver(e) {
  e.preventDefault();
  this.classList.add('over');
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragLeave() {
  this.classList.remove('over');
}

function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation();
  if (elementBeingDragged !== this) {
    //"this" is the element on which elementBeingDragged is being dropped on
    this.parentNode.removeChild(elementBeingDragged); 
    const dropHTML = e.dataTransfer.getData('text/html');  //dropHtml is the html of the element being dragged
    this.insertAdjacentHTML('beforebegin', dropHTML);
    const dropElem = this.previousSibling; 
    addDnDHandlers(dropElem);
    saveTasks();
  }
  return false;
}

function handleDragEnd() {
  //removig the css when element is finally dropped
  this.classList.remove('dragging');
  document.querySelectorAll('#taskList li').forEach(li => li.classList.remove('over'));
}

function addDnDHandlers(elem) {
  //adding drag n drop handlers on the element dropped as they were removed while dragging
  elem.draggable = true;
  elem.addEventListener('dragstart', handleDragStart);
  elem.addEventListener('dragover', handleDragOver);
  elem.addEventListener('dragleave', handleDragLeave);
  elem.addEventListener('drop', handleDrop);
  elem.addEventListener('dragend', handleDragEnd);
}

// Initialize drag-and-drop handlers for existing tasks
document.querySelectorAll('#taskList li').forEach(addDnDHandlers);
