import { io } from "socket.io-client";
import "./style.css";
const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
const socket = io(serverUrl,{autoConnect:false});
const canvas=document.querySelector("#game"),ctx=canvas.getContext("2d");
const status=document.querySelector("#status");
let joined=false,players={},me=null;
const keys=new Set();
document.querySelector("#join").onclick=()=>{socket.connect();socket.emit("join",{name:document.querySelector("#name").value||"Driver",room:document.querySelector("#room").value||"BAY"});};
socket.on("connect",()=>status.textContent="Connected · joining…");
socket.on("joined",data=>{joined=true;me=data.id;status.textContent="Racing in room "+data.room;});
socket.on("state",data=>{players=data.players||{};});
socket.on("disconnect",()=>{joined=false;status.textContent="Disconnected";});
window.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());});
window.addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
function loop(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#176b3a";ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.strokeStyle="#ddd";ctx.lineWidth=90;ctx.beginPath();ctx.ellipse(480,300,330,220,0,0,Math.PI*2);ctx.stroke();
ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.setLineDash([16,16]);ctx.beginPath();ctx.ellipse(480,300,330,220,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
for(const [id,p] of Object.entries(players)){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=id===me?"#ffcf33":"#e74c3c";ctx.fillRect(-15,-9,30,18);ctx.fillStyle="#222";ctx.fillRect(4,-7,8,14);ctx.restore();ctx.fillStyle="#fff";ctx.font="14px sans-serif";ctx.fillText(p.name||"Driver",p.x-22,p.y-18);}
if(joined){socket.emit("input",{up:keys.has("w")||keys.has("arrowup"),down:keys.has("s")||keys.has("arrowdown"),left:keys.has("a")||keys.has("arrowleft"),right:keys.has("d")||keys.has("arrowright")});}
requestAnimationFrame(loop);}
loop();