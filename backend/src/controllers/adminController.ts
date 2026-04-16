import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    // 1. Get counts for the dashboard cards
    const pendingCount = await prisma.artefact.count({
      where: { verificationStatus: 'PENDING' } 
    });

    const totalVerified = await prisma.artefact.count({
      where: { verificationStatus: 'VERIFIED' }
    });

    const totalUsers = await prisma.user.count();

    // 2. Get the 10 most recent submissions to show in the table
    const recentSubmissions = await prisma.artefact.findMany({
  where: { verificationStatus: 'PENDING' },
  take: 10,
  orderBy: { createdAt: 'desc' },
  include: {
    contributor: { select: { name: true, email: true } }
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

export const verifyArtefact = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const artefact = await prisma.artefact.update({
      where: { id },
      data: { verificationStatus: 'VERIFIED' }
    });

    res.status(200).json({
      success: true,
      message: "Artefact verified successfully",
      artefact
    });

  } catch (error) {
    console.error("Verify Artefact Error:", error);
    res.status(500).json({ message: "Failed to verify artefact" });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const total = await prisma.artefact.count();

    const verified = await prisma.artefact.count({
      where: { verificationStatus: 'VERIFIED' }
    });

    const pending = await prisma.artefact.count({
      where: { verificationStatus: 'PENDING' }
    });

    const topContributors = await prisma.user.findMany({
      take: 5,
      orderBy: {
        artefacts: { _count: 'desc' }
      },
      include: {
        _count: { select: { artefacts: true } }
      }
    });

    res.json({
      summary: {
        total,
        verified,
        pending
      },
      topContributors
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to generate report" });
  }
};