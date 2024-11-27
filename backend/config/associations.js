// associations.js
const User = require('../models/User');
const Class = require('../models/Class');
const ClassProgress = require('../models/ClassProgress');
const Level = require('../models/Level');
const Boss = require('../models/Boss');
const Ability = require('../models/Ability');
const Quest = require('../models/Quest');
const QuestProgress = require('../models/QuestProgress');

function defineAssociations() {
  // User to ClassProgress (1:n)
  User.hasMany(ClassProgress, { foreignKey: 'UserId' });
  ClassProgress.belongsTo(User, { foreignKey: 'UserId' });

  // ClassProgress to Class (1:n)
  ClassProgress.belongsTo(Class, { foreignKey: 'ClassId' });
  Class.hasMany(ClassProgress, { foreignKey: 'ClassId' });

  // Class to Level (1:n) - Verwende Kleinbuchstaben `levels` als Alias
  Class.hasMany(Level, { foreignKey: 'ClassId', as: 'classLevels' });
  Level.belongsTo(Class, { foreignKey: 'ClassId', as: 'parentClass' });


  // Level to Boss (0:1) - Optional
  Level.belongsTo(Boss, { foreignKey: 'BossId', as: 'boss', allowNull: true });

  // Level to Ability (1:n)
  Level.hasMany(Ability, { foreignKey: 'LevelId', as: 'abilities' });
  Ability.belongsTo(Level, { foreignKey: 'LevelId', as: 'level' });

  // Quests to X
  // Level zu Quests (1:n)
  Level.hasMany(Quest, { foreignKey: 'LevelId', as: 'levelQuests' });
  Quest.belongsTo(Level, { foreignKey: 'LevelId', as: 'associatedLevel' });


  // Quest progress to X
  Quest.belongsToMany(User, { through: QuestProgress, foreignKey: 'QuestId' });
  User.belongsToMany(Quest, { through: QuestProgress, foreignKey: 'UserId' });

  // Beziehungen definieren
  QuestProgress.belongsTo(User, { foreignKey: 'UserId' }); // Ein User kann mehrere QuestProgress-Einträge haben
  User.hasMany(QuestProgress, { foreignKey: 'UserId' });

  QuestProgress.belongsTo(Quest, { foreignKey: 'QuestId' }); // Eine Quest kann in mehreren QuestProgress-Einträgen verwendet werden
  Quest.hasMany(QuestProgress, { foreignKey: 'QuestId' });
}

module.exports = defineAssociations;
