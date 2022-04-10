const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const scehma = mongoose.Schema;

const filesSchema = new scehma({
  senderEmail: {
    type: String,
    required: true,
  },

  fileName: {
    type: String,
    required: true,
  },

  filePath: {
    type: String,
    required: true,
  },

  size: {
    type: Number,
    required: false,
  },

  accessCode: {
    type: String,
    required: true,
  },
});

const Files = mongoose.model("files", filesSchema);

class FilesSevice {
  newFile(email, filename, filepath, size, accesscode) {
    let file = new Files({
      senderEmail: email,
      fileName: filename,
      filePath: filepath,
      size: size,
      accessCode: bcrypt.hashSync(accesscode, 10),
    });
    file.save();
  }

  findFile(aCode, cb) {
    Files.find({}, (err, files) => {
      for (let i = 0; i < files.length; i++) {
        if (bcrypt.compareSync(aCode, files[i].accessCode)) {
          return cb(false, files[i]);
        }
      }
      if (err) {
        return cb(true, null, {
          message: "Error: Something went wrong please try again..",
        });
      }
      return cb(true, null, {
        message:
          "There is no file under this access code, Check access code and try again..",
      });
    });
  }
}

module.exports = {
  filesSevice: new FilesSevice(),
  Files,
};
