import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, TicketStatus, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

const TICKET_INCLUDE = {
  createdBy: { select: { id: true, email: true, name: true, role: true } },
} as const;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface PaginatedTickets<T> {
  data: T[];
  meta: PaginationMeta;
}

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}


  async create(dto: CreateTicketDto, currentUser: User) {
    return this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdById: currentUser.id,
      },
      include: TICKET_INCLUDE,
    });
  }


  async findAll(
    currentUser: User,
    page: number,
    limit: number,
    q?: string,
  ): Promise<PaginatedTickets<any>> {
    const ownershipFilter =
      currentUser.role === Role.ADMIN ? {} : { createdById: currentUser.id };

    const searchFilter = q?.trim()
      ? {
          OR: [
            {
              title: {
                contains: q.trim(),
              },
            },
            {
              createdBy: {
                email: {
                  contains: q.trim(),
                },
              },
            },
            {
              createdBy: {
                name: {
                  contains: q.trim(),
                },
              },
            },
          ],
        }
      : {};

    const where =
      Object.keys(searchFilter).length > 0
        ? { AND: [ownershipFilter, searchFilter] }
        : ownershipFilter;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.ticket.count({ where }),
      this.prisma.ticket.findMany({
        where,
        include: TICKET_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }


  async findOne(id: string, currentUser: User) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: TICKET_INCLUDE,
    });

    if (!ticket) throw new NotFoundException(`Ticket "${id}" not found`);

    if (
      currentUser.role !== Role.ADMIN &&
      ticket.createdById !== currentUser.id
    ) {
      throw new NotFoundException(`Ticket "${id}" not found`);
    }

    return ticket;
  }


  async updateOwn(id: string, dto: UpdateTicketDto, currentUser: User) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) throw new NotFoundException(`Ticket "${id}" not found`);

    if (ticket.createdById !== currentUser.id) {
      throw new ForbiddenException('You can only edit your own tickets');
    }

    if (ticket.status !== TicketStatus.OPEN) {
      throw new ForbiddenException(
        'Tickets cannot be edited once they are in progress or resolved',
      );
    }

    return this.prisma.ticket.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
      include: TICKET_INCLUDE,
    });
  }


  async updateStatus(id: string, dto: UpdateTicketStatusDto) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException(`Ticket "${id}" not found`);

    return this.prisma.ticket.update({
      where: { id },
      data: { status: dto.status },
      include: TICKET_INCLUDE,
    });
  }


  async removeOwn(id: string, currentUser: User) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) throw new NotFoundException(`Ticket "${id}" not found`);

    if (ticket.createdById !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own tickets');
    }

    if (ticket.status === TicketStatus.RESOLVED) {
      throw new ForbiddenException('You cannot delete a resolved ticket');
    }

    await this.prisma.ticket.delete({ where: { id } });
    return { message: `Ticket "${id}" deleted successfully` };
  }
}
