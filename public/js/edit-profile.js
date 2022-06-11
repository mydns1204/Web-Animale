// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง feed.html แต่ถ้าไม่มีจะกลับไปที่ index.html
function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		window.location = "index.html";
	}
}

checkCookie();
window.onload = pageLoad;

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

function pageLoad(){
	getprofileInfo();
	document.getElementById('submitpic').onclick = fileUpload;
	document.getElementById('fileField').onchange = fileSubmit;

	var username = getCookie('username');
	
	document.getElementById("username").innerHTML = username;
	showImg('pic/'+getCookie('img'));
	console.log('pic/'+getCookie('img'));
	
	readPost();
}

function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writePost(msg);
}

function fileUpload(){
	document.getElementById('fileField').click();
}

function fileSubmit(){
	document.getElementById('formId').submit();
}

// แสดงรูปในพื้นที่ที่กำหนด
function showImg(filename){
	if (filename !==""){
		var showpic = document.getElementById('displayPic');
		showpic.innerHTML = "";
		var temp = document.createElement("img");
		temp.src = filename;
		showpic.appendChild(temp);
	}
}

const getprofileInfo = (async() => {
    await fetch("/readallprofile").then((response) => {
        response.json().then((data) => {
            // console.log(data);
            document.getElementById("username").innerHTML = data[0].username;
            document.getElementById("email").innerHTML = data[0].email;
        }).catch((err) => {
            console.log(err);
        })
    })
})

// อ่าน post จาก file
// complete it
// async function readPost(){
// 	let response = await fetch("/readPost");
// 	let content = await response.json();
// 	let post = await showPost(JSON.parse(content));
// }

// // เขียน post ใหม่ ลงไปใน file
// // complete it
// async function writePost(msg){
// 	var username = getCookie('username');
// 	let response = await fetch("/writePost",{
// 		method: "POST",
// 		headers: {
// 			'Accept': 'application/json',
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			user:username,
// 			message:msg})
// 	});
	
// 	let content = await response.json();
// 	let post = await showPost(JSON.parse(content));
// }

// // แสดง post ที่อ่านมาได้ ลงในพื้นที่ที่กำหนด
// function showPost(data){
// 	var keys = Object.keys(data);
// 	var divTag = document.getElementById("feed-container");
// 	divTag.innerHTML = "";
// 	for (var i = keys.length-1; i >=0 ; i--) {

// 		var temp = document.createElement("div");
// 		temp.className = "newsfeed";
// 		divTag.appendChild(temp);
// 		var temp1 = document.createElement("div");
// 		temp1.className = "postmsg";
// 		temp1.innerHTML = data[keys[i]]["message"];
// 		temp.appendChild(temp1);
// 		var temp1 = document.createElement("div");
// 		temp1.className = "postuser";
		
// 		temp1.innerHTML = "Posted by: "+data[keys[i]]["user"];
// 		temp.appendChild(temp1);
		
// 	}
// }