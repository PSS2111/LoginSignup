import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();    

const userData = mongoose.model('User', new mongoose.Schema({
    username: String,
    email: String,
    password: String
}));
export { userData };