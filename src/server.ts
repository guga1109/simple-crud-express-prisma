import express from 'express';
import session, {MemoryStore} from 'express-session';
import {createPost, getPosts, getPost, deletePost, updatePost} from "./controllers/posts.controller";
import { login, logout, signUp } from "./controllers/users.controller";
import {isAuthenticated} from "./auth/middleware";

interface User {
    id: number,
    name: string
}

declare module 'express-session' {
    interface SessionData {
        user: User, 
        logged_in: boolean
    }
}

const app = express();

const store = new MemoryStore();

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
        secure: false
    },
    store: store
}));

app.get('/', getPosts);

app.get('/post', getPost);

app.post('/create', isAuthenticated, createPost);

app.post('/delete/:id', isAuthenticated, deletePost);

app.put('/update', isAuthenticated, updatePost);

app.post('/login', login);

app.post('/signUp', signUp);

app.post('/logout', logout);

app.listen(3000, () => {
    console.log('Listening on port 3000.');
});