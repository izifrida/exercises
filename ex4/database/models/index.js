var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");

// Import configs from database/config/config.json
var config = require(path.join(__dirname, '..', 'config', 'config.json'))['database'];

// Create a Sequelize instance.
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var db = {};

// Read current folder, take all files, where models defined, and import them to sequelize
fs.readdirSync(__dirname)
    .filter(function (file) {
        // index.js - is this file, no models defined here
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        // Imports a model defined in another file.
        // Imported models are cached, so multiple calls to import with the same path will not load the file multiple times.
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;