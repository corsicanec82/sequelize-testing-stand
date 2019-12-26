export default (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
      timestamps: false,
    },
  );

  return Tag;
};
