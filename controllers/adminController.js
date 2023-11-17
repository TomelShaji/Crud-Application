
const User = require('../models/userModel')
const bcrypt = require('bcrypt')


const loadLogin = async(req,res) => {
    try {
        
        res.render('login')
        
    } catch (error) {
        console.log(error.message)
    }
}

// const verifyLogin = async (req,res) => {

//     try {
        
//         const email = req.body.email
//         const password = req.body.password

//         const userData =  await User.findOne({email:email})
//         if (userData) {
            
//             const passwordMatch = await bcrypt.compare(password,userData.password)
//             if (passwordMatch) {
            
//                 if(userData.is_admin === 0){
//                     res.render('login',{message:'Email and password is incorrect'})
//                 }else{
//                     req.session.user_id = userData._id
//                     res.redirect('/admin/home')
//                 }

//             } else {
//                 res.render('login',{message:'Email and password is incorrect'})
//           }

//         } else {
//             res.render('login',{message:'Email and password is incorrect'})
//         }

//     } catch (error) {
//         console.log(error.message)
//     }
// }

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            
            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: 'Email and password are incorrect' });
                } else {
                    req.session.user_id = userData._id;
                    req.session.is_admin = true;  // Set the admin flag
                    res.redirect('/admin/home');
                }
            } else {
                res.render('login', { message: 'Email and password are incorrect' });
            }
        } else {
            res.render('login', { message: 'Email and password are incorrect' });
        }
    } catch (error) {
        console.log(error.message);
    }
}



// const loadDashboard = async(req,res) => {
//     try {

//         const userData = await User.findById({_id:req.session.user_id})
//          const userDetails = await User.find({is_admin:0})
//         res.render('home',{admin:userData,users:userDetails})

//     } catch (error) {
//         console.log(error.message)
//     }
// }

const loadDashboard = async(req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        let userDetails;

        if (req.query.search) {
            // If search query is present, filter users by name, email, or mobile
            userDetails = await User.find({
                is_admin: 0,
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } },
                    { mobile: { $regex: req.query.search, $options: 'i' } }
                ]
            });
        } else {
            // If no search query, get all non-admin users
            userDetails = await User.find({ is_admin: 0 });
        }

        res.render('home', { admin: userData, users: userDetails });
    } catch (error) {
        console.log(error.message);
    }
};


const logout = async(req,res) => {
    try {
        
        req.session.destroy()
        res.redirect('/admin')

    } catch (error) {
        console.log(error.message)
    }
}

const newUserLoad = async(req,res)=>{
    try {
        res.render('new-user')
    } catch (error) {
        console.log(error.message);
    }
}

// const addUser = async(req,res) => {
//     try {
 
//         const name = req.body.name
//         const email = req.body.email
//         const mobile = req.body.mobile
//         // const image = req.file.filename
//         const password = randomstring.generate(8)

//         const spassword = await securepassword(password)

//         const user = new User({
//             name:name,
//             email:email,
//             mobile:mobile,
//             // image:image,
//             password:spassword
//         })

//         const userData = await user.save()

//         if (userData) {
            
//             res.redirect('/admin/home')

//         } else {
//             res.render('new-user',{message:'Something Wrong'})
//         }
        
//     } catch (error) {
//         console.log(error.message)
//     }

const securePassword = async(password)=>{
    try {
       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async(req,res)=>{
    try {
        const spassword = await securePassword(req.body.password);
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.render('new-user', { message: "Email already exists, try another one" });
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
            res.redirect('/admin/home');
        }
        else{
            res.render('/new-user',{message:"Registration has been failed"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
            res.render('edit-user',{user:userData});
        }
        else{
            res.redirect('/admin/home')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

// const updateUsers = async(req,res)=>{
//     try {
//         const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,password:req.body.password,mobile:req.body.mobile,image:req.body.image}});
//        res.redirect('/admin/home');
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const updateUsers = async (req, res) => {
    try {
      const { id, name, email, password, mobile, image } = req.body;
  
      
      
      if (password) {
        updatedPassword = await securePassword(password);
      }
  
      const updateFields = {
        name,
        email,

        password: updatedPassword || req.user.password,
        mobile,
        image,
      };
  
      const userData = await User.findByIdAndUpdate({ _id: id }, { $set: updateFields });
      res.redirect('/admin/home');
    } catch (error) {
      console.log(error.message);
    }
  };
  
// const deleteUser = async(req,res)=>{
//     try {
//         const id = req.query.id;
//          await User.deleteOne({_id:id});
        
//         res.redirect('/admin/home');
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const deleteUser = async (req, res) => {
    try {
        const id = req.query.id;

       
        await User.deleteOne({ _id: id });

        
        if (req.session.user_id === id) {
            req.session.destroy(() => {
                res.redirect('/login');
            });
        } else {
            res.redirect('/admin/home');
        }
    } catch (error) {
        console.log(error.message);
    }
};

  
module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}

