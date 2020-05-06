const express = require("express");

const Posts = require("../data/db")

const router = express.Router();

router.post("/", (req, res) => {
    const {title} = req.body.title;
    const {contents} = req.body.contents;
    if (title === "" && contents === "") {
        return res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }
    Posts.insert(req.body)
    .then(post => {
        res.status(201).json(post)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "There was an error while saving the post to the database"});
    });
});

router.post("/:post_id/comments", (req, res) => {
    const {post_id} = req.params;
    const {text} = req.body;
    if (text === "" || typeof text !== "string") {
        return res.status(400).json({errorMessage: "Please provide text for the comment."})
    }
    Posts.insertComment({text, post_id})
    .then(({id: comment_id}) => {
        Posts.findCommentById(comment_id)
        .then(([comment]) => {
            if (comment) {
                res.status(200).json(comment)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
    }).catch(error => {
        res.status(500).json({errorMessage: "There was an error while saving the post to the database" })
    })
});

router.get("/", (req, res) => {
    Posts.find(req.body)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving the posts",
        });
    });
});

router.get("/:id", (req, res) => {
    const post_id = req.params.id;
    if (post_id !== Posts.id) {
        Posts.findById(post_id)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error retrieving the posts",
            });
        });
    } else {
        res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
    }
});

router.get("/:id/comments", (req, res) => {
    const post_id = req.params.id;
    console.log(post_id);
    if (post_id) {
        Posts.findPostComments(post_id)
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error retrieving the comments",
            });
        });
    } else {
        res.status(404).json({message: "The post with the specified ID does not exist."});
    }

});

router.delete("/:id", (req, res) => {
    const post_id = req.params.id;
    let deleted_post = req.body;
    console.log("deleted_post", deleted_post)
    if (post_id) {
        Posts.findById(post_id)
        .then(deletedPost => {
            deleted_post = deletedPost;
        })
        Posts.remove(post_id)
        .then(total => {
            res.status(200).json(deleted_post)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error removing the post",
            });
        });
    } else {
        res.status(404).json({message: "The post with the specified ID does not exist."});
    }

});

router.put("/:id", (req, res) => {
    const post_id = req.params.id;
    const new_post_id = req.params.id
    const {title} = req.body.title;
    const {contents} = req.body.contents;
    if (!post_id) {
        res.status(404).json({message: "The post with the specificed ID does not exist."})
        if (title !== "" || contents !== "") {
            res.status(400).json({errorMessage: "Please provide title and contents for the post."})
        }
    }
    Posts.update(post_id, req.body)
    .then((new_post_id) => {
        console.log("Third Id: ", post_id);
        Posts.findById(post_id)
        .then(post => {
            res.status(200).json(post)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error updating the post",
            });
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error with first then",
        });
    });
});

module.exports = router;