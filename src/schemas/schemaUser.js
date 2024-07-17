const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userEmail: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    userPassword: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "user",
    timestamps: true,
  }
);

User.sync({ alter: true });

module.exports = User;
