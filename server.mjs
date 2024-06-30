// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const app = express();
// const server = createServer(app);
// const io = new Server(server);
// const secretKey = 'fghfhfh';
// const port = process.env.PORT || 3001;


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const users = [
//   { id: 1, username: 'user1', passwordHash: '$2a$10$SbTrX1kMnsIb5V72GvUJ2.Mm50aEpsaOr9DfO5CMWto81.HbD4nDq' } 
// ];

// function generateToken(user) {
//   return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
// }

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('join', (username) => {
//     console.log(`${username} joined`);
//     socket.username = username;
//     io.emit('user joined', username);
//   });

//   socket.on('message', (data) => {
//     console.log(`Message from ${data.username}: ${data.message}`);
//     io.emit('message', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.username);
//     if (socket.username) {
//       io.emit('user left', socket.username);
//     }
//   });
// });


// app.post('/auth/signup', (req, res) => {
//   const { username, password } = req.body;


//   if (users.find(u => u.username === username)) {
//     return res.status(400).json({ message: 'Username already exists' });
//   }


//   const salt = bcrypt.genSaltSync(10);
//   const passwordHash = bcrypt.hashSync(password, salt);


//   const newUser = { id: users.length + 1, username, passwordHash };
//   users.push(newUser);

  
//   const token = generateToken(newUser);
//   res.json({ token });
// });



// app.post('/auth/login', (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find(u => u.username === username);

//   if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
//     return res.status(401).json({ message: 'Invalid username or password' });
//   }

//   const token = generateToken(user);
//   res.json({ token });
// });


// app.get('/api/users', (req, res) => {
//   const users = ['Alice', 'Bob', 'Charlie'];
//   res.json(users);
// });


// server.listen(port, () => {
//   console.log(`Server listening on http://localhost:${port}`);
// });


import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const server = createServer(app);
const io = new Server(server);
const secretKey = 'fghfhfh';
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [
  { id: 1, username: 'user1', password: 'password' } 
];

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
}

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.username = username;
    io.emit('user joined', username);
  });

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('user left', socket.username);
    }
  });
});

// Middleware to log requests
app.use((req, res, next) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url} from ${clientIP}`);
  next();
});

app.post('/auth/signup', (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);

  const token = generateToken(newUser);
  res.json({ message: 'User created', token });
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = generateToken(user);
  res.json({ token });
});

app.get('/api/users', (req, res) => {
  const usersList = users.map(user => user.username);
  res.json(usersList);
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
