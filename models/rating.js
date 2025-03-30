const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Rating = sequelize.define(
  "rating",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
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
    tableName: "ratings",
  }
);

module.exports = Rating;
