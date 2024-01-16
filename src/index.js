const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const dbFilePath = 'database.db';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await createDatabase();
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function createDatabase() {
  // Check if the database file already exists
  if (fs.existsSync(dbFilePath)) {
    return;
  }

  const db = new sqlite3.Database(dbFilePath);

  const createTableSql = `
    CREATE TABLE IF NOT EXISTS timers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      dateCreated DATE,
      endTime TEXT,
      status TEXT
    )
  `;

  db.run(createTableSql, function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Database and table created successfully');
    }

    db.close();
  });
}

ipcMain.handle('database-handler', async (req, data) => {
  if (!data || !data.request) return;
  let timers;
  switch (data.request) {
    case 'Add':
      await addTimer(data.title, data.date);
      timers = await getTimers();
      break;
    case 'Get':
      timers = await getTimers();
      break;
    case 'Complete':
      await completeTimer(data.timerId)
      timers = await getTimers();
      break;
  }
  return timers;
});

async function completeTimer(id) {
  const db = new sqlite3.Database('database.db');
  const sql = 'UPDATE timers SET status = ? WHERE id = ?';
  const params = ['complete', id];

  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        console.log(`Timer with ID ${id} marked as complete`);
        resolve();
      }

      db.close();
    });
  });
}

function addTimer(title, endTime) {
  const db = new sqlite3.Database('database.db');
  const sql = 'INSERT INTO timers (title, dateCreated, endTime, status) VALUES (?, datetime("now"), ?, ?)';

  return new Promise((resolve, reject) => {
    db.run(sql, [title, endTime, 'active'], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        console.log(`Timer added with ID: ${this.lastID}`);
        resolve(this.lastID);
      }

      db.close();
    });
  });
}

async function getTimers() {
  const db = new sqlite3.Database('database.db');

  const sql = 'SELECT id, title, endTime FROM timers WHERE status = ?';
  const status = 'active';

  return new Promise((resolve, reject) => {
    db.all(sql, [status], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }

      db.close();
    });
  });
}
