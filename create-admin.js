const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('shukanmall');
    const admins = db.collection('admins');
    
    // Check if admin already exists
    const existingAdmin = await admins.findOne({ email: 'admin@shukanmall.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = {
      email: 'admin@shukanmall.com',
      password: hashedPassword,
      name: 'Admin User',
      createdAt: new Date(),
      isAdmin: true
    };
    
    await admins.insertOne(adminUser);
    console.log('Admin user created successfully!');
    console.log('Email: admin@shukanmall.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await client.close();
  }
}

createAdmin();