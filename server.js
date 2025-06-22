// const express = require('express');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/authRoutes');
// const brandsRoutes = require('./routes/brandsRoutes');
// const productRoutes = require('./routes/productRoutes');
// const categoriesRoutes = require('./routes/categoriesRoutes');
// const cartItemRoutes = require('./routes/cartItemRoutes');
// const wishlistItemsRoutes = require('./routes/wishlistItemsRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const reviewsRoutes = require('./routes/reviewRoutes');
// const uploader = require('./routes/uploaderRoutes');

// const authenticate = require('./middleware/authMiddleware.js');
// const cookieParser = require('cookie-parser');
// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cookieParser());
// app.use('/api/auth', authRoutes);

// app.use('/api/product',authenticate, productRoutes);
// app.use('/api/brands',authenticate, brandsRoutes);
// app.use('/api/categories', authenticate,categoriesRoutes);
// app.use('/api/cartItem', authenticate,cartItemRoutes);
// app.use('/api/wishlistItems', authenticate, wishlistItemsRoutes);
// app.use('/api/order',authenticate, orderRoutes);
// app.use('/api/review', authenticate,reviewsRoutes);
// app.use('/api/upload', authenticate, uploader);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

// First initialize `app`
const app = express();

// Then use it to create the server
const server = http.createServer(app);

// Now set up Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*',  // set your frontend origin
    methods: ['GET', 'POST']
  }
});
require('./socket')(io);
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const brandsRoutes = require('./routes/brandsRoutes');
const productRoutes = require('./routes/productRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const cartItemRoutes = require('./routes/cartItemRoutes');
const wishlistItemsRoutes = require('./routes/wishlistItemsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewsRoutes = require('./routes/reviewRoutes');
const uploader = require('./routes/uploaderRoutes');
const authenticate = require('./middleware/authMiddleware.js');

app.use('/api/auth', authRoutes);
app.use('/api/product', authenticate, productRoutes);
app.use('/api/brands', authenticate, brandsRoutes);
app.use('/api/categories', authenticate, categoriesRoutes);
app.use('/api/cartItem', authenticate, cartItemRoutes);
app.use('/api/wishlistItems', authenticate, wishlistItemsRoutes);
app.use('/api/order', authenticate, orderRoutes);
app.use('/api/review', authenticate, reviewsRoutes);
app.use('/api/upload', authenticate, uploader);

// Default route
app.get('/', (req, res) => {
  res.send('Socket server running');
});


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
