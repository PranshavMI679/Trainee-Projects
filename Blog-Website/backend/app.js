require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const { sequelize } = require('./models');

const routes = require('./routes/routes');

const errorMiddleware = require('./middleware/errorMiddleware');
const AppError = require('./utils/appError');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,  
  pingInterval: 25000 
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  try {
    const userId = socket.handshake.query.userId;
    
    if (userId) {
      socket.join(`room_${userId}`);
      console.log(`User connected and joined room: room_${userId}`);
    }
  } catch (socketErr) {
    console.error('Socket room assignment failed:', socketErr.message);
  }

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Blog Website API is running!' });
});

app.use('/api', routes);

app.all('*catchall', (req, res, next) => {
  next(new AppError(`The endpoint ${req.originalUrl} does not exist on this server.`, 404));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    await sequelize.sync({ alter: false }); 
    console.log('Database synchronized successfully.');

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
