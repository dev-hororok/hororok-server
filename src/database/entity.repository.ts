import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOne(filterQuery, {
      _id: 0,
      __v: 0,
      ...projection,
    });
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(filterQuery);
  }

  async create(createEntityData: unknown): Promise<T> {
    const newEntity = new this.entityModel(createEntityData);
    return newEntity.save();
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(filterQuery, updateEntityData, {
      new: true,
    });
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return 0 < deleteResult.deletedCount;
  }
}
