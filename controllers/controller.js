const { Files, filesSevice } = require("../models/files");
const { logService } = require("../models/logs");
const express = require("express");
const ip = require("ip");
const { sendMail, sendMailDownload } = require("../services/mail");

class Controller {
  index(req, res) {
    res.render("index", { title: "Home" });
  }

  sendFile_get(req, res) {
    res.render("sendFile", { title: "Upload Page" });
  }

  receiveFile_get(req, res) {
    let message = req.flash().msg || [];
    res.render("receiveFile", { title: "Download Page", message });
  }

  // generates access code and upload file+log to db
  sendFile_post(req, res) {
    genAccessCode().then((aCode) => {
      filesSevice.newFile(
        req.body.email,
        req.file.filename,
        req.file.path,
        req.file.size,
        aCode
      );
      logService.newUploadLog(req.body.email, req.file.filename);
      sendMail(req.body.email, aCode);
      return res.render("accessCodePage", {
        title: "Code Page",
        accessCode: aCode,
      });
    });
  }

  receiveFile_post(req, res) {
    filesSevice.findFile(req.body.accessCode, (err, file, messages) => {
      if (err) {
        req.flash("msg", messages.message);
        return res.redirect("/receiveFile");
      }
      let userIP = ip.address();
      logService.newDownLoadLog(userIP, file.fileName);
      sendMailDownload(file.senderEmail, userIP, file.fileName);
      return res.download(file.filePath, (err) => {
        if (err) {
          req.flash("msg", "Error: Something went wrong please try agian..");
          return res.redirect("/receiveFile");
        }
      });
    });
  }
}

let genAccessCode = async function () {
  let aCode = Math.floor(100000 + Math.random() * 900000).toString();
  while (await Files.exists({ accessCode: aCode })) {
    aCode = Math.floor(100000 + Math.random() * 900000).toString();
  }
  return aCode;
};

module.exports = {
  controller: new Controller(),
};
