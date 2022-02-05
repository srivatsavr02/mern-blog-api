const { google } = require("googleapis");
const bufferToStream = require("./buf2stream");

const KEYFILEPATH = "./mern-blog-340314-3fa64095417c.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const createAndUploadFile = (req, auth) => {
  const driveService = google.drive({ version: "v3", auth });

  const fileMetaData = {
    name: req.body.name,
    parents: ["1MWoFlabRcW0japeTeATmH-H2UvpzTgOV"],
  };

  const media = {
    mimeType: "image/",
    body: bufferToStream(req.file.buffer),
  };

  return driveService.files
    .create({
      resource: fileMetaData,
      media: media,
      fields: "id",
    })
    .then((response) => {
      req.fileId = response.data.id;
    })
    .catch((err) => {
      console.log(err);
    });
};

const moveFile = async (fileId, auth) => {
  const driveService = google.drive({ version: "v3", auth });

  folderId = "1jknTG2GLdXEfjmR_YPpceK9i-ULQtLRr";

  return driveService.files
    .get({
      fileId: fileId,
      fields: "parents",
    })
    .then(async (response) => {
      var previousParents = response.data.parents.join(",");
      await driveService.files
        .update({
          fileId: fileId,
          addParents: folderId,
          removeParents: previousParents,
          fields: "id, parents",
        })
        .then((response) => {
          console.log("File Moved!");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.createAndUploadFile = createAndUploadFile;
module.exports.moveFile = moveFile;
module.exports.auth = auth;
