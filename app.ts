import express, { Application } from "express";
import App from "./src/index";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const app: App = new App(PORT); 


app.listen();
