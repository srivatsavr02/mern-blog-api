var Readable = require("stream").Readable;

function bufferToStream(buffer) {
  var stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream;
}

module.exports = bufferToStream;
