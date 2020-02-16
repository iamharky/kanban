window.onload = () => {
  const dropZones = document.querySelectorAll('.drop-zone');
  dropZones.forEach(zone => {
    zone.addEventListener('drop', drop)
    zone.addEventListener('dragover', dragOver)
    zone.addEventListener('dragleave', dragLeave)
  })

  getStoredItems(dropZones);
  document.getElementById('adding-form').addEventListener('submit', addItem)
}

const getStoredItems = dropZones => {
  const createSpan = el => {
    const span = document.createElement('span');
    
    span.draggable = true;
    span.id = el.id;
    span.className = 'draggable';
    span.innerText = el.value;
    
    return span;
  }

  const todoZone = dropZones[0];
  const doingZone = dropZones[1];
  const doneZone = dropZones[2];

  const todos = JSON.parse(localStorage.getItem('todo'));
  const doings = JSON.parse(localStorage.getItem('doing'));
  const dones = JSON.parse(localStorage.getItem('done'));

  todos.forEach(el => todoZone.appendChild(createSpan(el))) ;
  doings.forEach(el => doingZone.appendChild(createSpan(el))) ;
  dones.forEach(el => doneZone.appendChild(createSpan(el))) ;
  
  document.getElementById('todolen').innerText = todos.length
  document.getElementById('doinglen').innerText = doings.length
  document.getElementById('donelen').innerText = dones.length
  
  setDraggableListeners();
}

const setDraggableListeners = () => {
  const items = document.querySelectorAll('.draggable');
  items.forEach(item => item.addEventListener('dragstart', dragStart))
} 

// ADDING NEW ITEM
const addItem = e => {
  e.preventDefault();
  const todo = document.getElementById('todo');
  const input = e.target.children[0].value;
  const newItem = document.createElement('span');
  const nospace = input.split(' ').join('');

  if (nospace.length > 2) {
    newItem.draggable = true;
    newItem.id = Math.random();
    newItem.className = 'draggable';
    newItem.innerText = input.trim();
    todo.appendChild(newItem);
    setDraggableListeners();
    e.target.children[0].value = ''
    UpdateAndSave()
  } else alert('Type in at least 3 characters!')
};

// CHECK COUNTS
const UpdateAndSave = () => {
  const dropZones = document.querySelectorAll('.drop-zone');
  const DOMtodo = Array.from(dropZones[0].children);
  const DOMdoing = Array.from(dropZones[1].children);
  const DOMdone = Array.from(dropZones[2].children);

  let todos = [];
  let doings = [];
  let dones = [];
  
  DOMtodo.forEach(todo => todos.push({id: todo.id, value: todo.textContent}))
  DOMdoing.forEach(doing => doings.push({id: doing.id, value: doing.textContent}))
  DOMdone.forEach(done => dones.push({id: done.id, value: done.textContent}))

  localStorage.setItem('todo', JSON.stringify(todos));
  localStorage.setItem('doing', JSON.stringify(doings));
  localStorage.setItem('done', JSON.stringify(dones));

  document.getElementById('todolen').innerText = todos.length
  document.getElementById('doinglen').innerText = doings.length
  document.getElementById('donelen').innerText = dones.length
}

// DROP ZONE EVENTS
const drop = e => {
  e.preventDefault();
  if(e.target.className === 'drop-zone') {
    const id = e.dataTransfer.getData('Text');
    if (e.target.id !== 'delete') {
      e.target.appendChild(document.getElementById(id));
    } else if(e.target.id === 'delete') {
      document.getElementById(id).remove();
    }
    e.target.style.opacity = '1'
    UpdateAndSave()
  } 
};

const dragOver = e => {
  e.preventDefault()
  if(e.target.className === 'drop-zone') {
    e.target.style.opacity = '0.6'
  }
};

const dragLeave = e => {
  if(e.target.className === 'drop-zone') {
    e.target.style.opacity = '1'
  }
};

// DRAGGABLE ITEM EVENTS
const dragStart = e => {
  e.dataTransfer.dropEffect = 'move';
  e.dataTransfer.setData('Text', e.target.id);
};