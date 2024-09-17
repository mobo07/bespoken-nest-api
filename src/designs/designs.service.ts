import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDesignDto } from './dto/create-design.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Design } from './schemas/design.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class DesignsService {
  constructor(@InjectModel(Design.name) private designModel: Model<Design>) {}
  async create(createDesignDto: CreateDesignDto) {
    const newDesign = await new this.designModel(createDesignDto).save();
    return newDesign;
  }

  async findAll() {
    const designs = await this.designModel.find();
    return designs;
  }

  async getOrderedDesigns(query: FilterQuery<Design>) {
    try {
      const designs = await this.designModel.find(query);
      return designs;
    } catch (_error) {
      throw new NotFoundException(`Couldn't find all designs`);
    }
  }

  async findOne(query: FilterQuery<Design>) {
    try {
      const design = await this.designModel.findOne(query);
      return design;
    } catch (_error) {
      throw new NotFoundException('Design not found');
    }
  }

  async update(
    query: FilterQuery<Design>,
    updateDesignDto: UpdateQuery<Design>,
  ) {
    try {
      const updatedDesignDto = await this.designModel.findOneAndUpdate(
        query,
        updateDesignDto,
        { new: true },
      );
      return updatedDesignDto;
    } catch (_error) {
      throw new NotFoundException('Design not found');
    }
  }

  async remove(id: string) {
    const deletedDesign = await this.designModel.findByIdAndDelete(id, {
      new: true,
    });
    return deletedDesign;
  }
}
