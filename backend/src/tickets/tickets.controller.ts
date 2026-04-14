import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import type { User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TicketsService } from './tickets.service';

@ApiTags('Tickets')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}


  @Post()
  @Roles(Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new support ticket (USER role required)' })
  @ApiResponse({ status: 201, description: 'Ticket created' })
  @ApiResponse({ status: 403, description: 'Forbidden — ADMIN cannot create tickets' })
  create(@Body() dto: CreateTicketDto, @CurrentUser() user: User) {
    return this.ticketsService.create(dto, user);
  }


  @Get()
  @ApiOperation({ summary: 'Get tickets with pagination and search (ADMIN: all | USER: own)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 9 })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search across title, creator name, creator email' })
  findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(9), ParseIntPipe) limit: number,
    @Query('q') q?: string,
  ) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    return this.ticketsService.findAll(user, safePage, safeLimit, q);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a single ticket by ID' })
  @ApiResponse({ status: 404, description: 'Not found or forbidden' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.ticketsService.findOne(id, user);
  }


  @Patch(':id')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Edit ticket title/description — USER only, status must be OPEN' })
  @ApiResponse({ status: 200, description: 'Ticket updated' })
  @ApiResponse({ status: 403, description: 'Ticket is not OPEN, or not owned by user' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.updateOwn(id, dto, user);
  }


  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update ticket status (ADMIN only)' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    return this.ticketsService.updateStatus(id, dto);
  }


  @Delete(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete own ticket — only if OPEN or IN_PROGRESS (USER only)' })
  @ApiResponse({ status: 403, description: 'Cannot delete resolved or unowned ticket' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.ticketsService.removeOwn(id, user);
  }
}
