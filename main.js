const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(res => {
    console.log(res);
    return IOhandler.readDir(pathUnzipped)
  })
  .then(files => files.map(file => {
    return IOhandler.grayScale(file, pathProcessed)
  }))
  .catch(err => console.log(err))
