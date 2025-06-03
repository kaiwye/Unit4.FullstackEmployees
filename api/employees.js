import express from "express";
const router = express.Router();
export default router;

import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "#db/queries/employees";

router
  .route("/")
  .get(async (req, res) => {
    const employees = await getEmployees();
    res.send(employees);
  })
  .post(async (req, res, next) => {
    if (!req.body) return res.status(400).send("Request body is required.");
    if (!req.body.name || !req.body.birthday || !req.body.salary)
      return res
        .status(400)
        .send("Employee requires a name, birthday, and salary.");
    try {
      const addEmployee = await createEmployee(req.body);
      res.status(201).send(addEmployee);
    } catch (err) {
      next(err);
    }
  });

router.param("id", async (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Id must be a positive integer");
  }
  try {
    const employee = await getEmployee(id);
    if (!employee) {
      return res.status(404).send("No employee found with associated Id");
    }
    req.employee = employee;
    next();
  } catch (err) {
    next(err);
  }
});

router
  .route("/:id")
  .get((req, res) => {
    res.send(req.employee);
  })
  .put(async (req, res, next) => {
    if (!req.body) {
      res.status(400).send("Request body required");
    }
    if (!req.body.name || !req.body.birthday || !req.body.salary) {
      return res
        .status(400)
        .send("Employee requires a name, birthday, and salary");
    }
    try {
      const updatedEmployee = await updateEmployee({
        id: req.employee.id,
        name: req.body.name,
        birthday: req.body.birthday,
        salary: req.body.salary,
      });
      res.send(updatedEmployee);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const removeEmployee = await deleteEmployee(req.employee.id);
      if (!removeEmployee)
        return res.status(400).send("Employee with that Id not found");
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
