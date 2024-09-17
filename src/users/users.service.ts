import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) throw new ConflictException('This user already exists');
    const { password, ...otherDetails } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      ...otherDetails,
      password: hashedPassword,
    });
    const newUser = await createdUser.save();
    return newUser.toObject();
  }

  async getAllUsers() {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async findUser(query: FilterQuery<User>) {
    const foundUser = (await this.userModel.findOne(query)).toObject();
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }

  async updateUser(
    query: FilterQuery<User>,
    userUpdate: UpdateQuery<User>,
  ): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      query,
      userUpdate,
      {
        new: true,
      },
    );
    return updatedUser;
  }

  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id, {
      new: true,
    });
    return deletedUser;
  }
}
