const mongoose= require('mongoose');
const bcrypt=require('bcrypt');

userSchema = new mongoose.Schema( {
	email: {
        type:String,
        unique:true,
        required:true,

       
    },
	password: {
        type:String,
     
    },
}),
userSchema.pre('save',function(next){
    const user= this;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password,salt,(err,hash)=>{
            if(err){
                return next(err);
            }
            user.password=hash;
            next();
        })
    })

})


userSchema.methods.comparePassword=function(candidatePassword){
const user= this;

console.log(user);
    return new Promise((resolve,reject)=>{
    bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
        if(err){
            return reject;
        }
        if(!isMatch){
            return reject(false);
        }
        resolve(true);
    })
})
}


User = mongoose.model('User', userSchema);

module.exports = User;
