import { Request, Response } from 'express';
import { db } from '../utils/firebase';
import { findOrCreateFolder, uploadVideoToDrive, streamVideoFromDrive } from '../services/driveService';
import fs from 'fs';

export const uploadAssessmentVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, videoType } = req.body;
    const file = req.file;

    if (!userId || !videoType || !file) {
      res.status(400).json({ error: 'Missing userId, videoType, or file' });
      return;
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    // Since users usually are created on frontend via Firebase Auth, 
    // we may just create the user doc if it doesn't exist to store driveFolderId.
    let folderId: string | undefined;

    if (userDoc.exists) {
      folderId = userDoc.data()?.driveFolderId;
    } else {
      // Create user record if it doesn't exist
      await userRef.set({ createdAt: new Date() }, { merge: true });
    }

    // 1. Ensure user has a drive folder
    if (!folderId) {
      // In a real scenario we might pass name/email. We use userId as fallback.
      const folderName = `Client - ${userId}`;
      const newFolderId = await findOrCreateFolder(folderName);
      if (newFolderId) {
        folderId = newFolderId;
        await userRef.update({ driveFolderId: folderId });
      }
    }

    if (!folderId) {
      res.status(500).json({ error: 'Failed to find or create Google Drive folder for user.' });
      return;
    }

    // 2. Upload video directly to Google Drive
    const dateStr = new Date().toISOString().split('T')[0];
    const desiredFileName = `[${dateStr}] - ${videoType} - Skill Test${getFileExtension(file.originalname)}`;
    
    const driveFileId = await uploadVideoToDrive(file.path, desiredFileName, folderId);

    // Clean up local temp file
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    if (!driveFileId) {
      res.status(500).json({ error: 'Failed to upload video to Google Drive.' });
      return;
    }

    // 4. Save to database
    const clientVideoRef = db.collection('clientVideos').doc();
    const clientVideo = {
      id: clientVideoRef.id,
      userId,
      driveFileId,
      videoType,
      createdAt: new Date()
    };
    await clientVideoRef.set(clientVideo);

    res.status(200).json({ success: true, clientVideo });
  } catch (error) {
    console.error("Upload Error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
       fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Internal server error while uploading.' });
  }
};

export const streamVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    
    // In a real scenario, you'd check auth token here
    // Verify if videoId is accessible for this user

    // We assume videoId is a driveFileId for simplicity or passed through our database ID
    // Let's assume it's the actual drive file id or a valid ClientVideo/WorkoutVideo ID.
    // For this example, if it's purely a router to stream generic valid videos, we pass videoId to stream.
    
    const rangeHeader = req.headers.range;

    await streamVideoFromDrive(videoId, rangeHeader, res);

  } catch (error) {
    console.error("Stream Error:", error);
    res.status(500).json({ error: 'Failed to stream video' });
  }
};

function getFileExtension(filename: string): string {
  const i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substring(i);
}
