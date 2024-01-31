const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name: { type: String, require: true },
    price: { type: String, require: true },
    desc: { type: String, require: true },
    category: { type: String, require: true },
    tag: { type: String, require: true },
    amount: { type: String, require: true },
})

module.exports=mongoose.model("users",UserSchema)