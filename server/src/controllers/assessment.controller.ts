import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

/**
 * Handle new user assessment submission
 * POST /api/assessment
 */
export const submitAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    // Usually retrieved from authenticated user token (e.g. req.user.id)
    // Here we'll take it from the body for demonstration
    const { userId, height, weight, goals, driveLink } = req.body;

    if (!userId || !height || !weight || !goals || !driveLink) {
       res.status(400).json({ message: 'Missing required fields' });
       return;
    }

    // Verify user is actually paid
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.status !== 'PAID') {
      res.status(403).json({ message: 'Assessments can only be submitted by paid users. Please complete payment.' });
      return;
    }

    // Create the assessment
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        height: Number(height),
        weight: Number(weight),
        goals,
        driveLink
      }
    });

    res.status(201).json({ message: 'Assessment created successfully', assessment });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ error: 'Assessment submission failed' });
  }
};
