const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path")
const port = 3000;
const tasksData = require("./tasks.json")
const Ajv = require("ajv");
 
app.use(express.json());

//Json file path
const jsonFilePath = path.join(__dirname, "tasks.json");
const ajv = new Ajv();

//defining a Task Schema
const taskSchema = {
    type: "object",
    properties: {
      id: { type: "number", minLength: 1 },
      title: { type: "string", minLength: 1 },
      description: { type: "string", minLength: 1 },
      completed: { type: "boolean" },
      priority: { type: "string", enum: ["low", "medium", "high"] },
    },
    required: ["title", "description", "completed"],
    additionalProperties: false,
  };

  //Writing a function to wrtite data to task.json file
  function writeFileSyncWrapper(file, data) {
    fs.writeFileSync(file, data, {
      encoding: "utf8",
      flag: "w",
    });
  }


app.get("/", (req, res) =>{
    res.status(200).send("Welcome to my first Task Manager App");
});



//Get all Task

app.get("/tasks",(req,res) =>{
    const { completed, sort } = req.query;
    let isCompleted = completed === undefined || completed.toLowerCase() === "false" ? false : true;
    let filteredTasks = tasksData;
    //Filtering the tasks
    filteredTasks = filteredTasks.tasks.filter(
        (task) => task.completed === isCompleted
    );

  if (sort !== undefined) {
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  res.status(200).send(filteredTasks);
});



//Get perticuler task
app.get("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasksData.tasks.find((task) => task.id === taskId);
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  });


// POST - create a new task
app.post("/tasks", (req, res) => {
    const newTask = req.body;
    let tasksModified = JSON.parse(JSON.stringify(tasksData));
    //validating a structure of request json and  from tasks.json 
    const validBody = ajv.validate(taskSchema, newTask);
    if (validBody) {
      newTask.createdAt = Date.now();
      tasksModified.tasks.push(newTask);
      //Writing to file
      writeFileSyncWrapper(jsonFilePath, JSON.stringify(tasksModified));
      res.status(201).json(newTask);
    } else {
      res.status(400).json({ message: "Invalid task data" });
    }
  });


//PUT update an existing task by taskId
app.put("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;
    let tasksModified = JSON.parse(JSON.stringify(tasksData));
    const valid = ajv.validate(taskSchema, updatedTask);
    if (valid) {
      const taskIndex = tasksModified.tasks.findIndex(
        (task) => task.id == taskId
      );
      if (taskIndex !== -1) {
        updatedTask.id = taskId;
        updatedTask.createdAt = tasksModified.tasks[taskIndex].createdAt;
        tasksModified.tasks[taskIndex] = updatedTask;
        writeFileSyncWrapper(jsonFilePath, JSON.stringify(tasksModified));
        res.status(200).json(updatedTask);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid task data" });
    }
  });
  

//DELETE delete a task by taskId
app.delete("/tasks/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasksData.tasks.findIndex((task) => task.id === taskId);
    let tasksModified = JSON.parse(JSON.stringify(tasksData));
    if (taskIndex !== -1) {
      tasksModified.tasks.splice(taskIndex, 1);
      writeFileSyncWrapper(jsonFilePath, JSON.stringify(tasksModified));
      res.status(200).json({ message: "Task deleted" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  });
  

// GET- retrieve tasks based on priority level
app.get("/tasks/priority/:level", (req, res) => {
    const priorityLevel = req.params.level;
    const filteredTasks = tasksData.tasks.filter(
      (task) => task.priority === priorityLevel
    );
    res.status(200).json(filteredTasks);
  });
  

// Handle other errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

module.exports = app;
