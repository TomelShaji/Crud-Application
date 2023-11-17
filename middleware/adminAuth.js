// const isLogin = async(req,res,next)=>{
//     try {
//         if(req.session.user_id){}
//         else{
//             res.redirect('/admin')
//         }
//         next();
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// const isLogout = async(req,res,next)=>{
//     try {
//         if(req.session.user_id){
//             res.redirect('/admin/home');
//         }
//         next();
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// module.exports = {
//     isLogin,
//     isLogout
// }

//2

// const islogin = async(req,res,next) => {
//     try {
        
//         if(req.session.user_id){

//         }else{
//             res.redirect('/admin')
//         }
//         next()

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const isLogout = async(req,res,next) => {
//     try {
        
//         if (req.session.user_id) {
//             res.redirect('/admin/home')
//         } 
//         next()

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// module.exports ={
//     islogin,
//     isLogout
// }

const islogin = async (req, res, next) => {
    try {
        if (req.session.is_admin) {
            next();
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.is_admin) {
            res.redirect('/admin/home');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    islogin,
    isLogout
};
