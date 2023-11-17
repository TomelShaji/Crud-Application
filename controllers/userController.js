const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async(password)=>{
    try {
       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const loadRegister = async(req,res)=>{
    try {
        res.render('registration');
    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    try {
        const spassword = await securePassword(req.body.password);
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.render('registration', { message: "Email already exists, try another one" });
        }
      const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:spassword,
        mobile:req.body.mobile,
        image:req.file.filename,
        is_admin:0
        });

        const userData = await user.save();

        if(userData){
            res.redirect('/login');
        }
        else{
            res.render('registration',{message:"Registration has been failed"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

//login user  methods started

const loginLoad = async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
       const userData = await User.findOne({email:email});
       if (userData){
       const passwordMatch = await bcrypt.compare(password,userData.password)
       if(passwordMatch){
        // if(userData.is_verified === 0 ){
        //     res.render('login',{message:"Please verify your mail"})
        // }
        // else{
            req.session.user_id = userData._id;
            res.redirect('/home');
        // }
       }else{
        res.render('login',{message:"E-mail and Password Incorrect"})
       }
    } 
       else{
        res.render('login',{message:"E-mail and Password Incorrect"})
       }     
    } catch (error) {
        console.log(error.message);
    }
}

// const loadHome = async(req,res)=>{
//     try {
       
//         res.render('home');
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const loadHome = async (req, res) => {
    try {
        
        const userData = await User.findById({ _id: req.session.user_id });

        if (!userData) {
           
            req.session.destroy();
            return res.redirect('/login');
        }

        res.render('home', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadHome,
    // ... other functions
};


const userLogout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}