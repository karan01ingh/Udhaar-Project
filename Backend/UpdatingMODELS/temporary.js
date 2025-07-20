// import User from './models/User.js'; // Adjust path if needed
// mongoose.connection.once('open', async () => {
//   try {
//     console.log('Connected. Dropping index "uid_1"...');
//     await User.collection.dropIndex('uid_1');
//     console.log('Index "uid_1" dropped successfully.');
//   } catch (error) {
//     console.error('Error dropping index:', error.message);
//   }
// });


// if you have to update the model of the schema after running the connecting the mongo DB then you can just paste the code into the index.js file for just one time