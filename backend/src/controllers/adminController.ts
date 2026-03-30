import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    // 1. Get counts for the dashboard cards
    const pendingCount = await prisma.artefact.count({
      where: { verificationStatus: 'PENDING' } // Adjust 'status' based on your schema
    });

    const totalVerified = await prisma.artefact.count({
      where: { verificationStatus: 'VERIFIED' }
    });

    const totalUsers = await prisma.user.count();

    // 2. Get the 10 most recent submissions to show in the table
    const recentSubmissions = await prisma.artefact.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        contributor: { select: { name: true, email: true } } // Show who contributed it
      }
    });

    res.status(200).json({
      stats: {
        pending: pendingCount,
        verified: totalVerified,
        users: totalUsers
      },
      recentSubmissions
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch admin data' });
  }
};