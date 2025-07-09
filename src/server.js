require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { testConnection } = require('./models');

// Initialize express
const app = express();

// Import models and database connection
const { sequelize } = require('./config/database');
require('./models');

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Force sync all models
    // await sequelize.sync({ force: true });
    // console.log('Database tables have been synchronized');

    // Create default admin user
    // const { User, About, Contact, History, Slider, WhatIsGymkhana } = require('./models');
    
    // await User.create({
    //   username: 'admin',
    //   password: 'admin123',
    //   isAdmin: true
    // });
    // console.log('Default admin user created');

    // // Seed About data
    // await About.create({
    //   title: 'About Auto-Gymkhana',
    //   subtitle: 'A dynamic motorsport combining precision, skill, and competitive spirit',
    //   whatis: 'Auto Gymkhana is a motorsport where participants complete a predefined course with obstacles in the shortest time. The sport combines precision driving, quick thinking, and technical skill.',
    //   characteristics: JSON.stringify([{"value":"Course Duration: ~1 minute"},{"value":"Obstacles: Cones (50cm min height)"},{"value":"Max straight section: 50m"},{"value":"No reversing allowed"}]),
    //   organization: 'AAGC is managed by the Asia Gymkhana Working Group (GWG), established in 2005. ASNs from Asia-Pacific can nominate delegates to the GWG.',
    //   coordinator: 'Dr. Kwong Wing YEUNG',
    //   director: 'Samir Suneja',
    //   assistant: 'Chien Siang NG',
    //   isActive: true
    // });
    // console.log('About data seeded');

    // // Seed Contact data
    // await Contact.create({
    //   email: 'info@storeindia.live',
    //   phone: '7984810153',
    //   address: '302, Shyam Market, maninagar , kadodara',
    //   socialMedia: '{}'
    // });
    // console.log('Contact data seeded');

    // // Seed History data
    // const histories = [
    //   { title: 'Auto Gymkhana Taiwan Grand Prix (Taipei)', description: 'Funding the Asia Gymkhana Working Group (Taipei)', year: 2005, imageUrl: 'http://localhost:5001/uploads/history/1751038068008-803691871.jpg', isActive: true, order: 1 },
    //   { title: 'Indonesia Auto Gymkhana Championship', description: 'First Indonesia Auto Gymkhana Championship.', year: 2006, imageUrl: 'http://localhost:5001/uploads/history/1751038198170-753154758.jpg', isActive: true, order: 2 },
    //   { title: 'Taiwan Auto Gymkhana Championship', description: 'First Taiwan Auto Gymkhana Championship in Taichung.', year: 2016, imageUrl: 'http://localhost:5001/uploads/history/1751038240799-426119134.jpg', isActive: true, order: 3 },
    //   { title: 'Asia Auto Gymkhana Competition in 4 Countries', description: 'Asia Auto Gymkhana competition officially begins as a four-round series across Indonesia, Korea, Taiwan, and Thailand.', year: 2017, imageUrl: 'http://localhost:5001/uploads/history/1751038274602-606194641.jpg', isActive: true, order: 4 },
    //   { title: 'FIA recognited Auto Gymkhana as slalom', description: 'Asia Auto Gymkhana competition in 4 countries recognized as FIA Auto Slalom World Championship.', year: 2018, imageUrl: 'http://localhost:5001/uploads/history/1751038312513-986279969.jpg', isActive: true, order: 5 },
    //   { title: 'Asia Auto Gymkhana Competition in 3 Countries', description: '1st Taipei International Gymkhana Prize (Taipei).', year: 2019, imageUrl: 'http://localhost:5001/uploads/history/1751038341937-10420608.jpg', isActive: true, order: 6 },
    //   { title: '2nd FIA Motor Sport Games - Auto Slalom World Championship (Marseilles)', description: '2nd Taipei International Gymkhana Prize (Taipei).', year: 2022, imageUrl: 'http://localhost:5001/uploads/history/1751038377796-144633992.jpg', isActive: true, order: 7 },
    //   { title: '2nd Taipei International Gymkhana Prize (Taipei)', description: 'Asia Auto Gymkhana competition in 2 countries recognized as FIA Auto Slalom World Championship.', year: 2024, imageUrl: 'http://localhost:5001/uploads/history/1751038414014-222074404.jpg', isActive: true, order: 8 },
    //   { title: 'Asia Auto Gymkhana competition in 5 countries', description: 'Asia Auto Gymkhana competition in 5 countries.', year: 2025, imageUrl: 'http://localhost:5001/uploads/history/1751038442679-110128404.jpg', isActive: true, order: 9 }
    // ];
    
    // await History.bulkCreate(histories);
    // console.log('History data seeded');

    // //Seed Slider data
    // const sliders = [
    //   { title: 'Asia Auto Gymkhana Championship 2025', subtitle: 'Experience the thrill of precision driving', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/2012_WTCC_Race_of_Japan_%28Race_1%29_opening_lap.jpg/500px-2012_WTCC_Race_of_Japan_%28Race_1%29_opening_lap.jpg', order: 1, isActive: true },
    //   { title: 'New Training Programs', subtitle: 'Master the art of technical driving', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/2012_WTCC_Race_of_Japan_%28Race_1%29_opening_lap.jpg/500px-2012_WTCC_Race_of_Japan_%28Race_1%29_opening_lap.jpg', order: 2, isActive: true }
    // ];

    // await Slider.bulkCreate(sliders);
    // console.log('Slider data seeded');

    // //Seed WhatIsGymkhana data
    // await WhatIsGymkhana.create({
    //   title: 'What is Gymkhana?',
    //   subtitle: 'Discover the thrilling motorsport that combines precision driving, technical skill, and competitive spirit.',
    //   description: 'Auto Gymkhana is a motorsport focusing on precision driving and car control. Drivers navigate through intricate courses, emphasizing technical skill over speed. Events challenge drivers to execute tight maneuvers while maintaining optimal racing lines.',
    //   competitionFormats: JSON.stringify(["Solo Format: Individual time trials","Double Format: Head-to-head races","Team Challenges: Country competitions","Special Events: Exhibition runs"]),
    //   technicalElements: JSON.stringify(["Slalom sections","Figure-eight patterns","360-degree turns"]),
    //   scoringElements: JSON.stringify(["Time penalties","Precision markers","Technical accuracy"]),
    //   isActive: true
    // });
    // console.log('WhatIsGymkhana data seeded');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
}

initializeDatabase();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3003','http://localhost:3001','http://localhost:3000','https://gmk.chronopulse.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Import routes
const userRoutes = require('./routes/userRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const contentRoutes = require('./routes/contentRoutes');
const whatIsGymkhanaRoutes = require('./routes/whatIsGymkhanaRoutes');
// const aboutSectionRoutes = require('./routes/aboutSectionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const sliderRoutes = require('./routes/sliderRoutes');
const newsRoutes = require('./routes/newsRoutes');
const historyRoutes = require('./routes/historyRoutes');
const contactRoutes = require('./routes/contactRoutes');
const messageRoutes = require('./routes/messageRoutes');

// API routes
app.use('/api/users', userRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/what-is-gymkhana', whatIsGymkhanaRoutes);
// app.use('/api/about-sections', aboutSectionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/slider', sliderRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Test database connection and sync models
// testConnection();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
