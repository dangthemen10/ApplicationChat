var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mangUserOnline = [];
io.on("connection", (socket) => {
    console.log("Co nguoi vua ket noi, socket id la: ",socket.id);
    socket.on("client_gui_username", (data)=>{
        console.log("Co nguoi dang ky username la: "+ data);
        if(mangUserOnline.indexOf(data) >= 0){
            socket.emit("server_send_dangky_thatbai", data)
        }else{
            mangUserOnline.push(data);
            socket.Username = data;
            io.sockets.emit("server_send_dangky_thanhcong", {username:data, id:socket.id});
        }
    });
    socket.on("client_gui_message", (data) => {
        io.sockets.emit("server_gui_message", {Username: socket.Username, msg:data});
    });
    socket.on("user_chocgheo_socketid_khac", (data) => {
        io.to(data).emit("server_xuly_chocgheo", socket.Username);
    });
});

app.get("/", (req, res) => {
    res.render("trangchu");
});