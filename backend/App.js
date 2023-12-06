const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect Mongodb

mongoose.connect('mongodb://127.0.0.1:27017/todo-list-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TaskSchema = new mongoose.Schema({
  taskName: String,
  description: String,
});

const Task = mongoose.model('Task', TaskSchema);

// All Routes

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Description
app.post('/tasks', async (req, res) => {
    const { taskName, description } = req.body;
  
    const task = new Task({
      taskName,
      description,
    });
  
    try {
      const newTask = await task.save();
      res.status(201).json(newTask);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

//   Update
  app.put('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      task.taskName = req.body.taskName;
      task.description = req.body.description;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
// Delete 

app.delete('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      await Task.deleteOne({ _id: req.params.id }); 
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
