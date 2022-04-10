const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Action = {
  upload: "upload",
  download: "download",
};

const logsSchema = new schema(
  {
    senderEmail: {
      type: String,
      required: false,
    },

    IP: {
      type: String,
      required: false,
    },

    action: {
      type: String,
      enum: Action,
    },

    file: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Logs = mongoose.model("logs", logsSchema);

class LogService {
  newUploadLog(email, file) {
    let log = new Logs({
      senderEmail: email,
      action: Action.upload,
      file: file,
    });
    log.save();
  }

  newDownLoadLog(ip, file) {
    let log = new Logs({
      IP: ip,
      action: Action.download,
      file: file,
    });
    log.save();
  }
}

module.exports = {
  logService: new LogService(),
  Logs,
};
