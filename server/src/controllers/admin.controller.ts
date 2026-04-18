import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

/**
 * Retrieve a list of paid clients and their associated assessment data
 * GET /api/admin/clients
 */
export const getPaidClients = async (req: Request, res: Response): Promise<void> => {
  try {
    // Note: ensure this route is protected by Admin Auth middleware
    
    const paidClients = await prisma.user.findMany({
      where: {
        status: 'PAID'
      },
      include: {
        assessment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ clients: paidClients });
  } catch (error) {
    console.error('Error fetching paid clients:', error);
    res.status(500).json({ error: 'Failed to retrieve clients' });
  }
};
