import { Schema, model, models } from "mongoose";

const taskSchema = new Schema({
  nombre: {
    type: String,
  },
  apellido: {
    type: String,
  },
  motivo: {
    type: String,
  },
});

const Task = models.Task || model("Task", taskSchema);

export default Task;
