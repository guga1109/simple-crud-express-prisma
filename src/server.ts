import express from 'express';
import { createPost, getPosts, getPost } from "./controllers/posts.controller";

const server = express();
server.use(express.json());

server.get('/', getPosts);

server.get('/post', getPost);

server.post('/create', createPost);

server.listen(3000, () => {
    console.log('Listening on port 3000.');
});