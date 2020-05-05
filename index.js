const express = require("express");

const postsRouter = require("./hubs/posts-router");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send({query: req.query, params: req.params, headers: req.headers});
});

server.use("/api/posts", postsRouter)

server.listen(4000, () => {
    console.log('\n Server is running on port 4000\n');
});