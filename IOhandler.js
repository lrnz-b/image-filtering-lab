/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const admzip = require("adm-zip"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    new admzip(pathIn).extractAllToAsync(
      pathOut, true, true, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve("Extraction complete");
        }
      }
    )
  })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(files
          .filter(file => file.includes('.png'))
          .map(file => {return path.join(dir, file)})
        );
      }
    })
  })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  const fileOut = path.join(pathOut, path.basename(pathIn))

  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .on('error', err => reject(err))
      .pipe(new PNG())
      .on('parsed', function(data) {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            let idx = (this.width * y + x) << 2;
            let avg = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

            data[idx] = avg;
            data[idx + 1] = avg;
            data[idx + 2] = avg;
          }
        }
        this.pack();
      })
      .on('error', err => reject(err))
      .pipe(fs.createWriteStream(fileOut))
      .on('finish', resolve("Grayscaling complete"))
      .on('error', err => reject(err))
  })
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
