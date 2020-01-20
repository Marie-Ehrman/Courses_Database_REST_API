'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
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
    materialsNeeded: DataTypes.STRING
  }, {sequelize});
  
  Course.associate = function(models) {
    // associations can be defined here
    models.Course.belongsTo(models.User);
  };
  return Course;
};