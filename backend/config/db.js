const mongoose =require("mongoose");



function Connects(){
mongoose.connect('mongodb://127.0.0.1:27017/todo-list-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{
    console.log('Database connected');
})
.catch((error)=>{
    console.log("Connection failed",error);
});
};

const TaskSchema = new mongoose.Schema({
  taskName: String,
  description: String,
});

const Task = mongoose.model('Task', TaskSchema);

module.exports=Connects;
