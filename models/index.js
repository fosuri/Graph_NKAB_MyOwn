const User = require("./user");
const Landmark = require("./landmark");
const Photo = require("./photo");
const Rating = require("./rating");

User.hasMany(Photo, { foreignKey: "userId", as: "photos" });
User.hasMany(Rating, { foreignKey: "userId", as: "ratings" });
User.hasMany(Landmark, { foreignKey: "userId", as: "landmarks" });

Landmark.hasMany(Photo, { foreignKey: "landmarkId", as: "photos" });
Landmark.hasMany(Rating, { foreignKey: "landmarkId", as: "ratings" });
Landmark.belongsTo(User, { foreignKey: "userId", as: "user" }); 

Photo.belongsTo(User, { foreignKey: "userId", as: "user" });
Photo.belongsTo(Landmark, { foreignKey: "landmarkId", as: "landmark" });

Rating.belongsTo(User, { foreignKey: "userId", as: "user" });
Rating.belongsTo(Landmark, { foreignKey: "landmarkId", as: "landmark" });

module.exports = { User, Rating, Photo, Landmark };
