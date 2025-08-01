const { db, bucket } = require("../utils/firebaseAdmin");
const { v4: uuidv4 } = require("uuid");

exports.submitQuery = async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = "";

    if (req.file) {
      const blob = bucket.file(`queries/${Date.now()}_${req.file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });

      blobStream.end(req.file.buffer);
      await new Promise((resolve, reject) => {
        blobStream.on("finish", resolve).on("error", reject);
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    }

    await db.collection("queries").add({
      uid: req.user.uid,
      text,
      imageUrl,
      createdAt: new Date()
    });

    res.send("Query submitted");
  } catch (err) {
    res.status(500).send("Query submission failed");
  }
};
