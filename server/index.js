import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
const app=express();app.use(cors());app.get("/",(_req,res)=>res.json({ok:true,service:"racer-bay-server"}));
const httpServer=createServer(app);
const io=new Server(httpServer,{cors:{origin:"*",methods:["GET","POST"]}});
const players=new Map();
const rooms=new Map();
io.on("connection",socket=>{
socket.on("join",({name="Driver",room="BAY"}={})=>{room=String(room).trim().toUpperCase().slice(0,16)||"BAY";name=String(name).trim().slice(0,16)||"Driver";socket.join(room);players.set(socket.id,{id:socket.id,name,room,x:480+Math.random()*50-25,y:80+Math.random()*40,angle:Math.PI/2,input:{}});if(!rooms.has(room))rooms.set(room,new Set());rooms.get(room).add(socket.id);socket.emit("joined",{id:socket.id,room});broadcast(room);});
socket.on("input",input=>{const p=players.get(socket.id);if(p)p.input=input||{};});
socket.on("disconnect",()=>{const p=players.get(socket.id);if(p){rooms.get(p.room)?.delete(socket.id);players.delete(socket.id);broadcast(p.room);}});});
function broadcast(room){const state={};for(const id of rooms.get(room)||[]){const p=players.get(id);if(p)state[id]={id,name:p.name,x:p.x,y:p.y,angle:p.angle};}io.to(room).emit("state",{players:state});}
setInterval(()=>{for(const p of players.values()){const i=p.input||{};if(i.left)p.angle-=.055;if(i.right)p.angle+=.055;const speed=i.up?3.2:i.down?-1.8:0;p.x=Math.max(15,Math.min(945,p.x+Math.cos(p.angle)*speed));p.y=Math.max(15,Math.min(585,p.y+Math.sin(p.angle)*speed));}for(const room of rooms.keys())broadcast(room);},50);
const port=process.env.PORT||3001;httpServer.listen(port,"0.0.0.0",()=>console.log("Racer Bay server listening on",port));