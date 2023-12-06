import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Input, Button } from 'antd';
import 'antd/dist/reset.css';

const { TextArea } = Input;

function TaskOperation() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    try {
      const response = await axios.post('http://localhost:5000/tasks', {
        taskName: taskInput,
        description: taskDescription,
      });
      setTasks([...tasks, response.data]);
      setTaskInput('');
      setTaskDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      console.log('Deleting task with ID:', id); 
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      const updatedTasks = tasks.filter((task) => task._id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  
  

  const editTask = async (id) => {
    setEditingTask(id);
    const selectedTask = tasks.find((task) => task._id === id);
    if (selectedTask) {
      setTaskInput(selectedTask.taskName);
      setTaskDescription(selectedTask.description || '');
    }
  };

  const updateTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, {
        taskName: taskInput,
        description: taskDescription,
      });
      const updatedTasks = tasks.map((task) =>
        task._id === id ? { ...task, taskName: taskInput, description: taskDescription } : task
      );
      setTasks(updatedTasks);
      setTaskInput('');
      setTaskDescription('');
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return   (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1>Online Notes
Taking - App</h1>
    <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Input
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Enter task..."
        style={{ width: '300px', marginBottom: '10px' }}
      />
      <TextArea
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Enter description..."
        style={{ width: '300px', marginBottom: '10px' }}
        autoSize={{ minRows: 3, maxRows: 6 }}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button type="primary " onClick={editingTask ? () => updateTask(editingTask) : addTask}>
          {editingTask ? 'Update Task' : 'Add Task'}
        </Button>
        {editingTask && (
          <Button onClick={() => setEditingTask(null)}>Cancel</Button>
        )}
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {tasks.map((task) => (
        <Card
          key={task._id}
          title={task.taskName}
          style={{ width: '80%', marginBottom: '10px', textAlign: 'left' }}
          extra={
            <div>
              <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => deleteTask(task._id)}>Delete</Button>
              <Button style={{ backgroundColor: 'green', color: 'white' }} onClick={() => editTask(task._id)}>Edit</Button>
            </div>
          }
        >
          <p style={{ whiteSpace: 'pre-wrap' }}>{task.description}</p>
        </Card>
      ))}
    </div>
  </div>
);
}

export default TaskOperation;
