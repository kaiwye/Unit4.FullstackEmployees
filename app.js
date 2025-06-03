import express from "express";
const app = express();
export default app;
import router from "./api/employees.js";

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Fullstack Employees API.");
});

app.use("/employees", router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong :(");
});
