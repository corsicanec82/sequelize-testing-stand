export default (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      title: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
      timestamps: false,
    },
  );

  return Task;
};
