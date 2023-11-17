const express = require('express');
const session = require('express-session');
const config = require("../config/config");
const bodyParser =require('body-parser');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/adminAuth')

const admin_route = express();

// admin_route.use((req, res, next) => {
//     res.setHeader('cache-control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//     res.setHeader('Expires', '-1');
//     res.setHeader('Pragma', 'no-cache');
//     next();
// });

admin_route.use((req, res, next) => {
    res.set('cache-control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');
    next();
});

admin_route.use(session({secret:config.sessionSecret}));

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}))

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const multer = require('multer');
const path = require('path');

admin_route.use(express.static('public'));

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

admin_route.get('/',auth.isLogout,adminController.loadLogin)

admin_route.post('/',adminController.verifyLogin)
admin_route.get('/home',auth.islogin,adminController.loadDashboard)

admin_route.get('/logout',auth.islogin,adminController.logout)

admin_route.get('/new-user',auth.islogin,adminController.newUserLoad);

admin_route.post('/new-user',upload.single('image'),adminController.addUser);

admin_route.get('/edit-user',auth.islogin,adminController.editUserLoad);

admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/delete-user',adminController.deleteUser)

admin_route.get('*',function(req,res){
    res.redirect('/admin')
})

module.exports =  admin_route;
