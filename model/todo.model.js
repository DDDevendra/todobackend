import mongoose from "mongoose";

const Todo = new mongoose.Schema({
    task:{
        type:'String'
    },

   level:{
        type:'String'
    }
    ,
    rate:{

        type : "String"
    }

})

export default mongoose.model('todo',Todo);