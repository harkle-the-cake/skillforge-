// associations.js
const User = require('../models/User');
const Class = require('../models/Class');
const ClassProgress = require('../models/ClassProgress');
const Level = require('../models/Level');
const Boss = require('../models/Boss');
const Ability = require('../models/Ability');

function defineAssociations() {
  // User to ClassProgress (1:n)
  User.hasMany(ClassProgress, { foreignKey: 'UserId' });
  ClassProgress.belongsTo(User, { foreignKey: 'UserId' });

  // ClassProgress to Class (1:1)
  ClassProgress.belongsTo(Class, { foreignKey: 'ClassId'});
  Class.hasMany(ClassProgress, { foreignKey: 'ClassId' });

  // Class to Level (1:n)
  Class.hasMany(Level, { foreignKey: 'ClassId' });
  Level.belongsTo(Class, { foreignKey: 'ClassId' });

  // Level to Boss (0:1)
  Level.belongsTo(Boss, { foreignKey: 'BossId', allowNull: true });

  // Level to Ability (1:n)
  Level.hasMany(Ability, { foreignKey: 'LevelId'});
  Ability.belongsTo(Level, { foreignKey: 'LevelId'});
}

module.exports = defineAssociations;
