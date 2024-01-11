import fs from 'fs';
import path from 'path';

function resolve(error) {
  return true;
}

function checkAvailability(itemPath) {
  try {
    const stats = fs.statSync(itemPath);
    return true;
  } catch (e) {
    return false;
  }
}

function createDirectory(directoryPath) {
  fs.mkdirSync(directoryPath);
  return true;
}

function deleteDirectory(directoryPath) {
  fs.rmdirSync(directoryPath, {
    recursive: true
  });
  return true;
}

function checkIsDirectory(directoryPath) {
  const stats = fs.statSync(directoryPath);
  return stats.isDirectory();
}

function checkIsFile(filePath) {
  const stats = fs.statSync(filePath);
  return stats.isFile();
}

function createFile(filePath) {
  const content = "";
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

function readFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
}

function deleteFile(filePath) {
  fs.unlinkSync(filePath);
  return true;
}

function scanDirectory(folderPath) {
  const items = fs.readdirSync(folderPath);
  const result = {
    files: [],
    directories: []
  };
  items.forEach(item => {
    const itemPath = path.join(folderPath, item);
    if (checkIsFile(itemPath)) result.files.push(item);
    else if (checkIsDirectory(itemPath)) result.directories.push(item);
  });
  return result;
}

function searchFile(directoryPath, fileToFind) {
  const results = [];
  const items = scanDirectory(folderPath);
  items.files.forEach(file => {
    if (file === fileToFind) results.push(file);
  });
  items.directories.forEach(folder => {
    const searchResult = searchFile(folder, fileToFind);
    results = [
      ...results,
      ...searchResult
      ];
  })
  return result;
}

export default class DBMS {
  constructor() {
    if (!checkAvailability("./database")) createDirectory("./database");
    if (!checkAvailability("./filebase")) createDirectory("./filebase");
  }

  createDocument({
    name
  }) {
    try {
      const databasePath = "database";
      const filePath = path.join(databasePath, name + ".json");
      if (checkAvailability(filePath)) return;
      const data = JSON.stringify({});
      writeFile(filePath, data);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  createSection({
    documentName,
    name
  }) {
    const databasePath = "database";
    const filePath = path.join(databasePath, documentName + ".json");
    try {
      const page = readFile(filePath);
      const object = JSON.parse(page);
      object[name] = [];
      const data = JSON.stringify(object);
      writeFile(filePath, data);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  addNewData({
    documentName,
    sectionName,
    toAdd
  }) {
    const databasePath = "database";
    const filePath = path.join(databasePath, documentName + ".json");
    try {
      const page = readFile(filePath);
      const object = JSON.parse(page);
      const keys = Object.keys(object);
      if (!keys.includes(sectionName)) throw new Error("section not found");
      keys.forEach(key => {
        if (key === sectionName) {
          object[sectionName] = [toAdd];
        }
        else {
          object[key] = [null];
        }
      });
      const data = JSON.stringify(object);
      writeFile(filePath, data);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  readData({
    documentName,
    findSection,
    whereSection,
    withValue
  }) {
    const databasePath = "database";
    const filePath = path.join(databasePath, documentName + ".json");
    try {
      const page = readFile(filePath);
      const object = JSON.parse(page);
      const results = [];
      object[whereSection].forEach((sectionValue, valueIndex) => {
        if (sectionValue === withValue) {
          const result = {};
          const keys = Object.keys(object);
          keys.forEach((key, index) => {
            if (index === valueIndex) {
              if (findSection && key === findSection) {
                result[key] = object[key][index];
              }
              else if (!findSection) {
                result[key] = object[key][index];
              }
            }
          });
          results.push(result);
        }
      })
      return results;
    } catch (e) {
      resolve(e);
    }
  }

  updateData({
    documentName,
    updateSection,
    toValue,
    whereSection,
    withValue
  }) {
    const databasePath = "database";
    const filePath = path.join(databasePath, documentName + ".json");
    try {
      const page = readFile(filePath);
      const object = JSON.parse(page);
      object[whereSection].forEach((sectionValue, valueIndex) => {
        if (sectionValue === withValue) {
          const keys = Object.keys(object);
          keys.forEach((key, index) => {
            if (index === valueIndex) {
              object[updateSection][index] = toValue;
            }
          });
        }
      })
      const data = JSON.stringify(object);
      writeFile(filePath, data);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  deleteData({
    documentName,
    whereSection,
    withValue
  }) {
    const databasePath = "database";
    const filePath = path.join(databasePath, documentName + ".json");
    try {
      const page = readFile(filePath);
      const object = JSON.parse(page);
      object[whereSection].forEach((sectionValue, valueIndex) => {
        if (sectionValue === withValue) {
          const keys = Object.keys(object);
          keys.forEach((key, index) => {
            if (index === valueIndex) {
              const keys = Object.keys(object);
              keys.forEach((key) => {
                object[key].splice(index, 1);
              });
            }
          });
        }
      });
      const data = JSON.stringify(object);
      writeFile(filePath, data);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  createFolder({
    folderName
  }) {
    const filebasePath = 'filebase';
    const folderPath = path.join(filebasePath, folderName);
    try {
      createDirectory(folderPath);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  hasFolder({
    folderName
  }) {
    const filebasePath = 'filebase';
    const folderPath = path.join(filebasePath, folderName);
    try {
      return checkAvailability();
    } catch (e) {
      resolve(e);
    }
  }

  deleteFolder({
    folderName
  }) {
    const filebasePath = 'filebase';
    const folderPath = path.join(filebasePath, folderName);
    try {
      deleteDirectory(folderPath);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  storeFile({
    folderName,
    fileName,
    content
  }) {
    const filebasePath = 'filebase';
    const filePath = path.join(filebasePath, folderName, fileName);
    try {
      writeFile(filePath, content);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  readFile({
    folderName,
    fileName
  }) {
    const filebasePath = 'filebase';
    const filePath = path.join(filebasePath, folderName, fileName);
    try {
      return readFile(filePath);
    } catch (e) {
      resolve(e);
    }
  }

  storeBlobFile({
    folderName,
    fileName,
    blob
  }) {
    const filebasePath = 'filebase';
    const filePath = path.join(filebasePath, folderName, fileName);
    try {
      const buffer = Buffer.from(blob, 'binary');
      writeFile(filePath, buffer);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  deleteFile({
    folderName,
    fileName
  }) {
    const filebasePath = 'filebase';
    const filePath = path.join(filebasePath, folderName, fileName);
    try {
      deleteFile(filePath);
      return true;
    } catch (e) {
      resolve(e);
    }
  }

  searchFile({
    folderName,
    fileName
  }) {
    const filebasePath = 'filebase';
    const folderPath = folderName ? path.join(filebasePath, folderName) : filebasePath;
    try {
      const results = searchFile(folderPath, fileName);
      return results;
    } catch (e) {
      resolve(e);
    }
  }
}