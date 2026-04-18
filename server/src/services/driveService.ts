import { google } from 'googleapis';
import fs from 'fs';
import { Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the Google Drive API client using a Service Account
// We assume GOOGLE_APPLICATION_CREDENTIALS points to the path of the JSON key file
// Or, alternative setup can use GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/drive'],
  // It handles local file path to the service account JSON automatically if GOOGLE_APPLICATION_CREDENTIALS is set
});

const drive = google.drive({ version: 'v3', auth });

const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID; // The main Alpha Calisthenics Clients folder

/**
 * Creates a folder in Google Drive or returns the existing one if it exists.
 */
export const findOrCreateFolder = async (folderName: string, parentFolderId?: string): Promise<string | null> => {
  const parentId = parentFolderId || ROOT_FOLDER_ID;
  if (!parentId) {
    console.error("No parent folder ID provided for Google Drive.");
    return null;
  }

  try {
    // 1. Search if folder already exists
    const query = `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const res = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
    });

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id || null;
    }

    // 2. If it doesn't exist, create it
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    };

    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    return folder.data.id || null;
  } catch (error) {
    console.error("Error finding or creating Google Drive folder:", error);
    return null;
  }
};

/**
 * Uploads a file to Google Drive and deletes it locally afterwards.
 */
export const uploadVideoToDrive = async (localFilePath: string, desiredFileName: string, parentFolderId: string): Promise<string | null> => {
  try {
    const fileMetadata = {
      name: desiredFileName,
      parents: [parentFolderId],
    };
    
    // Determine mimeType extension based on file
    let mimeType = 'video/mp4'; // default
    if (desiredFileName.endsWith('.mov')) mimeType = 'video/quicktime';
    if (desiredFileName.endsWith('.webm')) mimeType = 'video/webm';

    const media = {
      mimeType,
      body: fs.createReadStream(localFilePath),
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    // Clean up local temp file
    fs.unlinkSync(localFilePath);

    return file.data.id || null;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    return null;
  }
};

/**
 * Streams a video natively handling HTTP Range requests
 */
export const streamVideoFromDrive = async (driveFileId: string, rangeHeader: string | undefined, res: Response) => {
  try {
    // First, get file metadata to know the file size
    const fileMeta = await drive.files.get({
      fileId: driveFileId,
      fields: 'size, mimeType',
    });

    const fileSize = parseInt(fileMeta.data.size || '0', 10);
    const mimeType = fileMeta.data.mimeType || 'video/mp4';

    let requestHeaders: any = {};
    
    // Parse range header and set response headers
    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      const chunksize = (end - start) + 1;
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType,
      });

      requestHeaders['Range'] = `bytes=${start}-${end}`;
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
      });
    }

    // Proxy the stream out of Google Drive directly to the client
    const driveRes = await drive.files.get(
      { fileId: driveFileId, alt: 'media' },
      { responseType: 'stream', headers: requestHeaders }
    );

    driveRes.data.on('end', () => {
      // Done streaming
    }).on('error', (err: any) => {
        console.error('Error during video streaming:', err);
        if (!res.headersSent) res.sendStatus(500);
    });

    driveRes.data.pipe(res);

  } catch (error) {
    console.error("Error streaming video from Google Drive:", error);
    if (!res.headersSent) res.status(500).send("Error streaming video");
  }
};
