const mongoose = require("mongoose");
const sharp = require("sharp");
const Data = require("../models/data.js");
const File = require("../models/file.js");

const storageFileUpload = async (req, res) => {
  try {
    const userID = req.body.userID;
    const organizationID = req.body.organizationID;

    if (!userID) {
      return res.status(400).json({ error: "UserID is required!" });
    }

    if (!organizationID) {
      return res.status(400).json({ error: "OrganizationID is required!" });
    }

    // We get the user's data for a specific organization
    const userOrgData = await Data.findOne({ userID, organizationID }).populate("posts");

    if (!userOrgData) {
      return res.status(404).json({ error: "User's data for this organization doesn't found!" });
    }

    const fileObj = new File({ name: Buffer.from(req.file.originalname, "latin1").toString("utf8"), type: req.file.mimetype, binary: req.file.buffer });

    await fileObj.save();

    userOrgData.files.push(fileObj._id);

    await userOrgData.save();

    return res.status(200).json({ successMessage: "File stored with success!", storedFile: fileObj });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Server error." });
  }
};

const getStorageFiles = async (req, res) => {
  try {
    const userID = req.query.userID;
    const organizationID = req.query.organizationID;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10; // Number of files to return per page

    if (!userID) {
      return res.status(400).json({ error: "UserID is required!" });
    }

    if (!organizationID) {
      return res.status(400).json({ error: "OrganizationID is required!" });
    }

    // We get the user's data for a specific organization
    const userOrgData = await Data.findOne({ userID, organizationID }).populate({
      path: "files",
      options: {
        skip: (page - 1) * limit,
        limit: limit,
      },
    });

    if (!userOrgData) {
      return res.status(404).json({ error: "User's data for this organization doesn't found!" });
    }

    // Fetch the count of all files for the given userID and organizationID
    const data = await Data.findOne({ userID, organizationID });
    const totalFiles = data.files.length;

    return res.status(200).json({ files: userOrgData.files, totalFiles });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Server error." });
  }
};

const searchStorageFiles = async (req, res) => {
  try {
    const userID = req.query.userID;
    const organizationID = req.query.organizationID;
    const startsWith = req.query.startsWith.toLowerCase();

    if (!userID) {
      return res.status(400).json({ error: "UserID is required!" });
    }

    if (!organizationID) {
      return res.status(400).json({ error: "OrganizationID is required!" });
    }

    if (!startsWith) {
      return res.status(400).json({ error: "startsWith is required!" });
    }

    const userOrgData = await Data.findOne({ userID, organizationID }).populate("files");

    if (!userOrgData) {
      return res.status(404).json({ error: "User's data for this organization not found!" });
    }

    const filteredFiles = userOrgData.files.filter((file) => file.name.toLowerCase().startsWith(startsWith));

    return res.status(200).json({ filteredFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
};

const getStorageUploadedFile = async (req, res) => {
  try {
    const preview = req.query.preview;

    const fileObj = await File.findById(req.params.fileID);

    if (!fileObj) {
      throw new Error("No file found!");
    }

    res.set("Content-Type", fileObj.type);

    if (fileObj.name.match(".pdf")) {
      return res.status(200).send(fileObj.binary);
    }

    if (preview) {
      const buffer = await sharp(fileObj.binary)
        .resize({
          width: 300,
          height: 200,
        })
        .png()
        .toBuffer();

      return res.status(200).send(buffer);
    }

    res.status(200).send(fileObj.binary);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send("Server error.");
  }
};

const deleteStorageFile = async (req, res) => {
  try {
    const organizationID = req.query.organizationID;
    const fileID = req.query.fileID;

    if (!organizationID) {
      return res.status(400).json({ error: "OrganizationID is required!" });
    }

    if (!fileID) {
      return res.status(400).json({ error: "fileID is required!" });
    }

    // We get the user's data for a specific organization
    const userOrgData = await Data.findOne({ userID: req.user._id, organizationID }).select("files");

    if (!userOrgData) {
      return res.status(404).json({ error: "User's data for this organization doesn't found!" });
    }

    if (!userOrgData.files.includes(mongoose.Types.ObjectId(fileID))) {
      return res.status(404).json({ error: "File doesn't exists in user data!" });
    }

    const file = await File.findById(fileID);

    await file.delete();

    let fileIndex = -1;

    for (const [index, fileObj] of userOrgData.files.entries()) {
      if (fileObj._id.toString() === fileID) {
        fileIndex = index;
        break;
      }
    }

    if (fileIndex > -1) {
      userOrgData.files.splice(fileIndex, 1);
      await userOrgData.save();
    }

    return res.status(200).json({ successMessage: "File has deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = {
  storageFileUpload,
  getStorageFiles,
  searchStorageFiles,
  getStorageUploadedFile,
  deleteStorageFile,
};
