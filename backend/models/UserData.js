const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name: { type: String, require: true },
    price: { type: Number, require: true },
    desc: { type: String, require: true },
    category: { type: String, require: true },
    tag: { type: String, require: true },
    amount: { type: Number, require: true },
})

module.exports=mongoose.model("users",UserSchema)