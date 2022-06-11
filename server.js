const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3001;
const bodyParser = require('body-parser');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


const con = mysql.createConnection({
    host: "localhost",
    user: "oppotop9",
    password: "Toppotop9T",
    database: "mydb"
})

con.connect(err => {
    if (err){
        throw(err);
    }
    else{
        console.log("MySQL connection");
    }
})

let tableName = "userInfo";
let adminRole = "false";

const queryDB = (sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result,fields) => {
            if (err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

app.post("/regis",async (req, res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),description VARCHAR(200),tack VARCHAR(100),img VARCHAR(100))";
    let result = await queryDB(sql);
    var user = req.body.username;
    var mail = req.body.email;
    var pass = req.body.password;
    var repass = req.body.retypePassword;
    console.log(pass,repass);
    
    if(pass!=repass){
    console.log("password not match");
    return res.redirect('/signUp.html');
    }
    if(pass==""||repass==""||user==""||mail==""){
    console.log("please enter content");
    return res.redirect('/signUp.html');
    }
    else{
        sql = `INSERT INTO userInfo (username, email, password, img) 
        VALUES ("${req.body.username}","${req.body.email}","${req.body.password}","avatar.png")`;
        result = await queryDB(sql);
        console.log("New record created successfullyone");
        return res.redirect('/index.html');
        }
})

app.post("/checkLogin",async (req, res) => {
    var user = req.body.username;
    var pass = req.body.password;
    
    // var userdb = `SELECT username FROM ${tableName}`; ////อดีต
    // var passdb = `SELECT password FROM ${tableName}`;
    // let userCheck = await queryDB(userdb);
    // let passCheck = await queryDB(passdb);
    // passCheck = Object.assign({},passCheck);
    // console.log(userCheck,passCheck);
    // if (user==userCheck&&pass==passCheck)
    var userdb=`SELECT id,username,password,img,description,tack FROM ${tableName}`;
    var userCheck = await queryDB(userdb);

    console.log(userCheck[0].username,userCheck[0].password,user,pass);

    if (user==(userCheck[0].username)&&pass==(userCheck[0].password))
    {
        res.cookie('username', userCheck[0].username);
        res.cookie('img', userCheck[0].img);
        res.cookie('user_id', userCheck[0].id);
        res.cookie('descript', userCheck[0].description);
        res.cookie('tackD', userCheck[0].tack);
        console.log("Login successful");
        console.log("Welcome back admin");
        adminRole="True";
        return res.redirect('/feed.html');
    }



    //----------------------สำหรับ user มากกว่า 1 คน ให้เปิด comment ทีละ condition-----------------------

    // if(user==(userCheck[1].username)&&pass==(userCheck[1].password)){ 
    //     res.cookie('username', userCheck[1].username);
    //     res.cookie('img', userCheck[1].img);
    //     res.cookie('user_id', userCheck[1].id);
    //     res.cookie('descript', userCheck[1].description);
    //     res.cookie('tackD', userCheck[1].tack);
    //     console.log("Login successful");
    //     console.log("Welcome User");
    //     return res.redirect('/feed.html');
    // }
    // if(user==(userCheck[2].username)&&pass==(userCheck[2].password)){ 
    //     res.cookie('username', userCheck[2].username);
    //     res.cookie('img', userCheck[2].img);
    //     res.cookie('user_id', userCheck[2].id);
    //     res.cookie('descript', userCheck[2].description);
    //     res.cookie('tackD', userCheck[2].tack);
    //     console.log("Login successful");
    //     console.log("Welcome User");
    //     return res.redirect('/feed.html');
    // }
    // if(user==(userCheck[3].username)&&pass==(userCheck[3].password)){
    //     res.cookie('username', userCheck[3].username);
    //     res.cookie('img', userCheck[3].img);
    //     res.cookie('user_id', userCheck[3].id);
    //     res.cookie('descript', userCheck[3].description);
    //     res.cookie('tackD', userCheck[3].tack);
    //     console.log("Login successful");
    //     console.log("Welcome User");
    //     return res.redirect('/feed.html');
    // }
    // if(user==(userCheck[4].username)&&pass==(userCheck[4].password)){
    //     res.cookie('username', userCheck[4].username);
    //     res.cookie('img', userCheck[4].img);
    //     res.cookie('user_id', userCheck[4].id);
    //     res.cookie('descript', userCheck[4].description);
    //     res.cookie('tackD', userCheck[4].tack);
    //     console.log("Login successful");
    //     console.log("Welcome User");
    //     return res.redirect('/feed.html');
    // }
    // if(user==(userCheck[5].username)&&pass==(userCheck[5].password)){
    //     res.cookie('username', userCheck[5].username);
    //     res.cookie('img', userCheck[5].img);
    //     res.cookie('user_id', userCheck[5].id);
    //     res.cookie('descript', userCheck[5].description);
    //     res.cookie('tackD', userCheck[5].tack);
    //     console.log("Login successful");
    //     console.log("Welcome User");
    //     return res.redirect('/feed.html');
    // }
    //--------------------------------------------------------------------------------------------------

    
    else{
        console.log("username or password are incorrect");
        return res.redirect('/index.html?error=1');
        }
    
    
    
    
})

app.get("/profile",async (req, res) => {
    // var userdb=`SELECT username,description,tack FROM ${tableName}`;
    // var userCheck = await queryDB(userdb);
	// document.getElementById('username').innerHTML = "Test";
    // document.getElementById('datadescription').innerHTML = userCheck[0].description;
    // document.getElementById('tack').innerHTML = userCheck[0].tack;
    
    return res.redirect('/profile.html?user=1');
})

app.post("/editinfo",async (req, res) => {
  
    // var userdb = `SELECT username FROM ${tableName}`; ////อดีต
    // var passdb = `SELECT password FROM ${tableName}`;
    // let userCheck = await queryDB(userdb);
    // let passCheck = await queryDB(passdb);
    // passCheck = Object.assign({},passCheck);
    // console.log(userCheck,passCheck);
    // if (user==userCheck&&pass==passCheck)
    var db = `UPDATE ${tableName} SET description = '${req.body.description}',tack = '${req.body.tack}' WHERE username = '${req.body.username}'`;
    var result = await queryDB(db);
    res.cookie('descript',req.body.description);
    res.cookie('tackD',req.body.tack);
    console.log(result);
    //res.end("Record updated successfully");
    return res.redirect('/profile.html?user=1');
    //return res.redirect('/edit-profile.html');
    
})

app.post("/editpass",async (req, res) => {
  
    // var userdb = `SELECT username FROM ${timageFilterableName}`; ////อดีต
    // var passdb = `SELECT password FROM ${tableName}`;
    // let userCheck = await queryDB(userdb);
    // let passCheck = await queryDB(passdb);
    // passCheck = Object.assign({},passCheck);
    // console.log(userCheck,passCheck);
    // if (user==userCheck&&pass==passCheck)
    var db = `UPDATE ${tableName} SET password = '${req.body.newpassword}' WHERE email = '${req.body.email}'`;
    var result = await queryDB(db);
    console.log(result);
    //res.end("Record updated successfully");
    return res.redirect('/feed.html');
    //return res.redirect('/edit-profile.html');
    
})

const storage = multer.diskStorage({
    // destination: (req, file, callback) => {
    //   callback(null, './pic/image/');
    // },
    destination:'./public/pic/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

app.post('/profilepic', (req,res) => {
    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');
    let user = req.cookies.username

    upload(req, res, (err) => {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err) {
            return res.send(err);
        }
        let filename = req.file.filename
        updateImg(user, filename).then(()=>{
            console.log(filename)
            res.cookie('img', filename)
            console.log('Change Complete')
            //return res.redirect('/feed.html')
            return res.redirect('profile.html')
        })
    })
})

app.get('/readPost', async (req,res) => {
    let msg_read = await readJson('js/postDB.json');
    res.json(msg_read);
})

//ทำให้สมบูรณ์
// app.post('/writePost',async (req,res) => {
//     const newMsg = req.body
//     let msg_read = await readJson('js/postDB.json');
//     let jsonMsg = await JSON.parse(msg_read)
//     var Obj = Object.keys(jsonMsg);
//     var index = Obj.length + 1;
//     console.log(Obj);
//     jsonMsg["post"+index] = newMsg;
//     console.log(jsonMsg);
//     var newJsonMsg = JSON.stringify(jsonMsg);
//     let newMsg_read = await writeJson(newJsonMsg,'js/postDB.json')
//     res.json(newJsonMsg);
// })

const readJson = (file_name) => {
    return new Promise((resolve,reject) => {
        fs.readFile(file_name,'utf8',(err,data) => {
          if(err){
            reject(err);
          }
          else{
            resolve(data);
          }
        });
    })
}

//ทำให้สมบูรณ์
// const writeJson = (data,file_name) => {
//     return new Promise((resolve,reject) => {
//         fs.writeFile(file_name,data,(err) => {
//           if(err){
//             reject(err);
//           }
//           else{
//             resolve("save message");
//           }
//         })
//     })
// };

const updateImg = async (username, filename) => {
    let sql = `UPDATE userInfo SET img = '${filename}' WHERE username = '${username}'`;
    let result = await queryDB(sql);
    console.log(result);
}




app.post("/submitpost", async(req, res) => {
    //console.log(req.body);
    writePost(req);
    postdata = await readPost();
    console.log("Send data to client!")
    res.end(postdata);
})

const writePost = async(data) => {
    return new Promise((resolve, rejects) => {
        //console.log(data);
        let sql = "CREATE TABLE IF NOT EXISTS postInfo (id INT AUTO_INCREMENT PRIMARY KEY, post_date DATETIME DEFAULT CURRENT_TIMESTAMP, username VARCHAR(255), post VARCHAR(255),like_count VARCHAR(100),like_user LONGTEXT)";
        let result = queryDB(sql);
        sql = `INSERT INTO postInfo (username, post, like_count,like_user) VALUES ("${data.cookies.username}", "${data.body.post}", "${data.body.likecount}","0")`;
        result = queryDB(sql);
        console.log("Post Success!");
        resolve("Post Success!");
        console.log(result)
    })
}

const readPost = async() => {
    return new Promise((resolve, reject) => {
        con.query(`SELECT id,DATE_FORMAT(post_date,"%Y-%m-%d %H:%i")AS post_date,username,post,like_count,like_user FROM postInfo`, async function(err, result, fields) {
            if (err) {
                //console.log(err);
                resolve(JSON.stringify("No post found", null, "\t"));
                reject(err);
            } else {
                console.log("Read Success!");
                resolve(JSON.stringify(result, null, "\t"));
            }
        })
    })
}


app.post("/getposterimg", async(req, res) => {
    console.log(req.body.posterEmail);
    let sqldata = `SELECT img FROM userInfo WHERE username = '${req.body.username}'`;
    let resultdata = await queryDB(sqldata);
    console.log(resultdata[0].img);
    res.end(JSON.stringify(resultdata[0].img));
})


app.post("/likepost", async(req, res) => {
    //console.log(req.body.postid);
    postres = await updateLikePost(req);
    res.end(postres);
})

const updateLikePost = async(postid) => {
    let likedata = `SELECT like_count,like_user FROM postInfo WHERE id = '${postid.body.postid}'`;
    let resultlikedata = await queryDB(likedata);
    var likeCount = parseInt(resultlikedata[0].like_count);
    likeCount++;
    var likeUser = resultlikedata[0].like_user;
    likeUser += ", " + postid.cookies.user_id;
    let sql = `UPDATE postInfo SET like_count = '${likeCount}' WHERE id = '${postid.body.postid}'`;
    let result = await queryDB(sql);
    let sqlid = `UPDATE postInfo SET like_user = '${likeUser}' WHERE id = '${postid.body.postid}'`;
    let resultid = await queryDB(sqlid);
    return JSON.stringify(likeCount);
}

app.get("/readallprofile", async(req, res) => {
    // console.log(req.header.referer);
    let sql = `SELECT email,username FROM userInfo WHERE username = '${req.cookies.username}'`;
    let result = await queryDB(sql);
    res.end(JSON.stringify(result));
})

app.get("/readallpost", async(req, res) => {
    postdata = await readPost();
    console.log("Send data to client!")
    res.end(postdata);
})

app.get("/logout", (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    
    return res.redirect('index.html');
})

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/`);
});