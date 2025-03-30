const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Photo = sequelize.define(
  "Photo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    landmarkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "landmarks",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    tableName: "photos",
  }
);

module.exports = Photo;
