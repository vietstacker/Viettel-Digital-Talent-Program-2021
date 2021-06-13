const mongoose = require("mongoose");

/**
 * Schema for Task
 */
const taskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            trim: true,            
        },
        boardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board' 
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        },
    },
    //Collect created_at & updated_at timestamp 
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;