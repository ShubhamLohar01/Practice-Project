document.addEventListener("DOMContentLoaded", ()=>{
    const storedTasks = JSON.parse(localStorage.getItem('task'))
//for store in console window-> application-> local storageS

    if(storedTasks){
        storedTasks.forEach((task)=> task.push(task))
            updateTasklist();
            updateStats();
    }
})


let tasks = [];

const saveTasks =() =>{
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const addTask = () => {
    const taskInput = document.getElementById('task-input');
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });//complete false indicates Bydefault task is not completed
        taskInput.value = "",
            updateTasklist();
            saveTasks();
           
    }
    updateStats();
}

const toggleTaskComplete = (index)=>{
  tasks[index].completed = !tasks[index].completed;
    updateTasklist();
    updateStats();
    saveTasks();
}
const deleteTask = (index) =>{
    tasks.splice(index,1);
    updateTasklist();
    updateStats();
    saveTasks();
}
const editTask = (index)=>{
    const taskInput = document.getElementById("task-input");
    taskInput.value = tasks[index].text;
    tasks.splice(index,1);
    updateTasklist();
    updateStats();
}


const blastConfetti = ()=>{
  const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
}




const updateStats = ()=>{
    const completeTasks = tasks.filter(task=> task.completed).length
    const totalTasks = tasks.length;
    const progress = (completeTasks/totalTasks)*100
   
    const progressBar = document.getElementById('progress')

    progressBar.style.width = `${progress}%`;

    document.getElementById('numbers').innerText= `${completeTasks} / ${totalTasks}`;

    if(completeTasks === totalTasks){
      blastConfetti();
    };
};


const updateTasklist = () => {
    const tasklist = document.getElementById('task-list');
    tasklist.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
      <div class = "taskItem">
        <div class="task ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="checkbox"${
                task.completed ? "checked" : ""
            }/>
            <p>${task.text}</p>
        </div>
         <div class="icons">
        <img src="./img/Delete.png" onClick="deleteTask(${index})"/>
         <img src="./img/edit.png" onClick="editTask(${index})"/>
       </div>
    </div>

        `;
        listItem.addEventListener("change", () => toggleTaskComplete(index));
        tasklist.append(listItem);
    });
};

document.getElementById("newTask").addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
})
