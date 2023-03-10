const express = require("express");
const Project = require("../models/projects.js");

const router = new express.Router();

router.post("/api/project", async function (req, res) {
  const projectObj = new Project({
    ...req.body,
  });

  try {
    await projectObj.save();
    res.status(201).send(projectObj);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/api/projects", async function (req, res) {
  try {
    Project.find({}).then((result) => {
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/api/projects/:identifier", async function (req, res) {
  try {
    const deletedProject = await Project.findOneAndDelete({ _id: req.params.identifier });

    if (!deletedProject) {
      return res.status(404).send("Project doesn't found!");
    }

    res.status(200).send(deletedProject);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;