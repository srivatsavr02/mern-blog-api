const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const verify = require("../middleware/verify");
const { auth, moveFile } = require("../middleware/drive");


//UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.user._id);

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
  
      if (req.body.profilePic) {
        const picId = user.profilePic;
        await moveFile(picId, auth);
      }
  
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found");
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
    
  if(req.body.userId === req.params.id) {

      try {
          const user = await User.findById(req.params.id);
          const posts = await Post.find({ username: user.username });
          await Promise.all(
              posts.map(async (post) => {
                const picId = post.photo;
                await moveFile(picId, auth);
                await post.delete();
          }));

          const picId = user.profilePic;
          await moveFile(picId, auth);

          await user.delete();
          res.status(200).json("User has been deleted...");

      } catch(err) {
          res.status(404).json("User not found!");
      }

  } else {
      res.status(401).json("You can delete only your account!");
    }
});

//GET USER
router.get("/:id", verify,  async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { _id, password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;