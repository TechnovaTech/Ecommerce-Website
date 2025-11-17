const { MongoClient } = require('mongodb');

async function addSampleCategories() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('shukanmall');
    const categories = db.collection('categories');
    
    // Sample categories with placeholder images
    const sampleCategories = [
      {
        name: 'Electronics',
        status: 'active',
        image: '/placeholder.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fashion',
        status: 'active',
        image: '/placeholder.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Home & Garden',
        status: 'active',
        image: '/placeholder.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sports',
        status: 'active',
        image: '/placeholder.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Books',
        status: 'active',
        image: '/placeholder.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Toys',
        status: 'active',
        image: '/placeholder.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Clear existing categories
    await categories.deleteMany({});
    
    // Insert sample categories
    await categories.insertMany(sampleCategories);
    
    console.log('Sample categories added successfully!');
    console.log('Categories:', sampleCategories.map(cat => cat.name).join(', '));
    
  } catch (error) {
    console.error('Error adding categories:', error);
  } finally {
    await client.close();
  }
}

addSampleCategories();