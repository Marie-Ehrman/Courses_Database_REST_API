'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName:{
      type: DataTypes.STRING,
      allowNull: false, // disallow null
        //set validators to disallow empty field
        validate: {
            notNull: {
                msg: 'Please provide a value for "First Name"',
            },
            notEmpty: { // prevent the first name value from being set to an empty string
                msg: '"First Name" is required'         
            }      
        }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false, // disallow null
        //set validators to disallow empty field
        validate: {
            notNull: {
                msg: 'Please provide a value for "Last Name"',
            },
            notEmpty: { // prevent the last name value from being set to an empty string
                msg: '"Last Name" is required'         
            }      
        }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false, // disallow null
        //set validators to disallow empty field
        validate: {
            notNull: {
                msg: 'Please provide a value for "Email Address"',
            },
            notEmpty: { // prevent the email value from being set to an empty string
                msg: '"Email" is required'         
            },
            isEmail: true,
        }
    },
    password: {
       type: DataTypes.STRING,
      allowNull: false, // disallow null
        //set validators to disallow empty field
        validate: {
            notNull: {
                msg: 'Please provide a value for "Password"',
            },
            notEmpty: { // prevent the Password value from being set to an empty string
                msg: '"Password" is required'         
            }      
        }
     }
  }, {sequelize});


  User.associate = (models) => {
    // associations defined here
    models.User.hasMany(models.Course,{
      foreignKey: {
        fieldName: 'userId',
        allowNull: false
      }
    });
  };

  return User;

};