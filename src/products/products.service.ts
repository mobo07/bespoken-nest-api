import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { QueryFilter } from 'src/types/query.interface';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto) {
    const newProduct = await new this.productModel(createProductDto).save();
    return newProduct;
  }

  async getProducts(query: QueryFilter) {
    const resPerPage = query.resPerPage || 3;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    try {
      const queryFilter = this.getQueryFilter(query);
      const products = await this.productModel
        .find(queryFilter)
        .skip(skip)
        .limit(resPerPage);
      return products;
    } catch (error) {
      if (error) throw new Error(error);
    }
  }

  async getOrderedProducts(query: FilterQuery<Product>) {
    try {
      const products = await this.productModel.find(query);
      return products;
    } catch (_error) {
      throw new NotFoundException(`Couldn't find all products`);
    }
  }

  private getQueryFilter(query: QueryFilter) {
    const { type, customizable } = query;
    let filter = {};
    if (type) {
      filter = { type, ...filter };
    }
    if (customizable) {
      filter = {
        customizable: customizable === 'true' ? true : false,
        ...filter,
      };
    }
    return filter;
  }

  async getProduct(query: FilterQuery<Product>): Promise<Product> {
    try {
      const product = await this.productModel.findOne(query);
      return product;
    } catch (_error) {
      throw new NotFoundException(`Product not found`);
    }
  }

  async updateProduct(
    query: FilterQuery<Product>,
    productUpdate: UpdateQuery<Product>,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productModel.findOneAndUpdate(
        query,
        productUpdate,
        { new: true },
      );
      return updatedProduct;
    } catch (_error) {
      throw new NotFoundException('Product not found');
    }
  }

  async deleteProduct(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id, {
      new: true,
    });
    return deletedProduct;
  }
}
