import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('designs')
@Controller('designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createDesignDto: CreateDesignDto) {
    return this.designsService.create(createDesignDto);
  }

  @Get()
  async findAll() {
    return this.designsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.designsService.findOne({ _id: id });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateDesignDto: UpdateDesignDto,
  ) {
    return this.designsService.update({ _id: id }, { $set: updateDesignDto });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.designsService.remove(id);
  }
}
