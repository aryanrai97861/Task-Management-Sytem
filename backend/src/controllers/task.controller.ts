import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';
import { TaskStatus } from '@prisma/client';

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional()
});

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional()
});

const querySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  q: z.string().optional()
});

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { page, limit, status, q } = querySchema.parse(req.query);

    // Build where clause
    const where: any = { userId };
    
    if (status) {
      where.status = status;
    }
    
    if (q) {
      where.title = { contains: q, mode: 'insensitive' };
    }

    // Get total count
    const total = await prisma.task.count({ where });

    // Get paginated tasks
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { title, description, status } = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status as TaskStatus || 'TODO',
        userId
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = updateTaskSchema.parse(req.body);

    // Check ownership
    const existingTask = await prisma.task.findFirst({ where: { id, userId } });
    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }

    const task = await prisma.task.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check ownership
    const existingTask = await prisma.task.findFirst({ where: { id, userId } });
    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }

    await prisma.task.delete({ where: { id } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function toggleTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check ownership
    const existingTask = await prisma.task.findFirst({ where: { id, userId } });
    if (!existingTask) {
      throw new AppError('Task not found', 404);
    }

    // Toggle status: TODO -> IN_PROGRESS -> DONE -> TODO
    const statusMap: Record<TaskStatus, TaskStatus> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'TODO'
    };

    const task = await prisma.task.update({
      where: { id },
      data: { status: statusMap[existingTask.status] },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
}
