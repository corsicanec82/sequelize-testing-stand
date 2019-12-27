import { Op } from 'sequelize';
import { Task, Tag } from '../db/models';

describe('associations', () => {
  beforeAll(async () => {
    Task.hasMany(Tag, { foreignKey: 'task_id', onDelete: 'CASCADE' });
    await Task.sync({ force: true });
    await Tag.sync({ force: true });
  });

  it('# create tasks & tags', async () => {
    const task1 = await Task.create({ title: 'task1' });
    const task2 = await Task.create({ title: 'task2' });

    const tag1 = await Tag.create({ name: 'tag1' });
    const tag2 = await Tag.create({ name: 'tag2' });
    const tag3 = await Tag.create({ name: 'tag3' });
    const tag4 = await Tag.create({ name: 'tag4' });
    const tag5 = await Tag.create({ name: 'tag5' });
    const tag6 = await Tag.create({ name: 'tag6' });

    await task1.addTags([tag1, tag2, tag3]);
    await task2.addTag([tag4, tag5, tag6]);

    const actualTasks = await Task.findAll({ raw: true });
    const expectedTasks = [
      { id: 1, title: 'task1' },
      { id: 2, title: 'task2' },
    ];
    expect(actualTasks).toEqual(expectedTasks);

    const actualTags = await Tag.findAll({ raw: true });
    const expectedTags = [
      { id: 1, name: 'tag1', task_id: 1 },
      { id: 2, name: 'tag2', task_id: 1 },
      { id: 3, name: 'tag3', task_id: 1 },
      { id: 4, name: 'tag4', task_id: 2 },
      { id: 5, name: 'tag5', task_id: 2 },
      { id: 6, name: 'tag6', task_id: 2 },
    ];
    expect(actualTags).toEqual(expectedTags);
  });

  it('# remove association', async () => {
    const task = await Task.findOne({ where: { title: 'task1' } });

    const tags = await task.getTags({
      where: {
        [Op.not]: { name: 'tag2' },
      },
    });
    await task.removeTags(tags);
    const actual = await task.getTags({ raw: true });
    const expected = [
      { id: 2, name: 'tag2', task_id: 1 },
    ];
    expect(actual).toEqual(expected);
  });

  it('# set association', async () => {
    const task = await Task.findOne({ where: { title: 'task2' } });

    // remove all associations
    await task.setTags([]);
    const emptyTags = await task.getTags({ raw: true });
    expect(emptyTags).toEqual([]);

    const tags = await Tag.findAll({ where: { name: ['tag5', 'tag6'] } });
    await task.setTags(tags);
    const actual = await task.getTags({ raw: true });
    const expected = [
      { id: 5, name: 'tag5', task_id: 2 },
      { id: 6, name: 'tag6', task_id: 2 },
    ];
    expect(actual).toEqual(expected);
  });
});
