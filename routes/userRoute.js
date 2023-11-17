const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser =require('body-parser');
const userController = require('../controllers/userController');
const session = require('express-session');
const config = require("../config/config")
const auth = require('../middleware/auth')

const user_route = express();

// user_route.use((req, res, next) => {
//     res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.setHeader('Expires', '-1');
//     res.setHeader('Pragma', 'no-cache');
//     next();
// });

user_route.use((req, res, next) => {
    res.set('cache-control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');
    next();
});

user_route.use(session({secret:config.sessionSecret}));

user_route.use(express.static('public'));

user_route.set('view engine','ejs');
user_route.set('views','./views/users');


user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))



const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});
const upload = multer({storage:storage})


user_route.get('/register',auth.isLogout,userController.loadRegister);

user_route.post('/register',upload.single('image'),userController.insertUser);

user_route.get('/',auth.isLogout,userController.loginLoad);
user_route.get('/login',auth.isLogout,userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/home',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userLogout);

module.exports = user_route;