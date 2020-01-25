'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // disallow null
        //set validators to disallow empty field
        validate: {
            notNull: {
                msg: 'Please provide a value for "Title"',
            },
            notEmpty: { // prevent the title value from being set to an empty string
                msg: '"First Name" is required'         
            }      
        }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false, // disallow null
        //set validators to disallow empty field
        validate: {
            notNull: {
                msg: 'Please enter a "Description"',
            },
            notEmpty: { // prevent the description value from being set to an empty string
                msg: '"Description" is required'         
            }      
        }
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
    }
  }, {sequelize});
  
  Course.associate = (models) => {
    // associations defined here
    models.Course.belongsTo(models.User,{
        foreignKey: {
            fieldName: 'userId',
            allowNull: false
        }
    });
  };
  return Course;
};