"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Manager,
      Color,
      Manager_Product,
      Version,
      MODEL,
      Status,
      History,
      Batch,
    }) {
      this.belongsToMany(Status, {
        as: "hasStatuses",
        through: History,
        foreignKey: "product_id",
        otherKey: "status_id",
      });
      this.belongsTo(Status, {
        foreignKey: "status_id",
        as: "status",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(Version, {
        foreignKey: "version_id",
        as: "version",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(MODEL, {
        foreignKey: "model_id",
        as: "model",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsToMany(Manager, {
        as: "managers",
        through: Manager_Product,
        foreignKey: "product_id",
        otherKey: "manager_id",
      });
      this.belongsTo(Color, {
        foreignKey: "color_id",
        as: "color",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(Batch, {
        foreignKey: "batch_id",
        as: "batch",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Product.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      model_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      version_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maintain_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 12,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: "products",
      modelName: "Product",
    }
  );
  return Product;
};
