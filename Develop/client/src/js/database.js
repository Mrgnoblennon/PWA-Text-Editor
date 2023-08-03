import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Add content to the database
const putDb = async (content) => {
  try {
    const db = await initdb();
    const tx = db.transaction('jate', 'readwrite'); // Start a read-write transaction
    const store = tx.objectStore('jate'); // Access the object store
    await store.add({ content }); // Add the content to the object store
    await tx.done; // Complete the transaction
    console.log('Data added to database:', content);
  } catch (error) {
    console.error('putDb error:', error);
  }
};

// Retrieve all content from the database
const getDb = async () => {
  try {
    const db = await initdb();
    const tx = db.transaction('jate', 'readonly'); // Start a read-only transaction
    const store = tx.objectStore('jate'); // Access the object store
    const data = await store.getAll(); // Get all data from the object store
    await tx.done; // Complete the transaction
    console.log('Data retrieved from database:', data);
    return data.map(item => item.content).join('\n'); // Extract and join content
  } catch (error) {
    console.error('getDb error:', error);
    return null;
  }
};

initdb();

export { putDb, getDb };
