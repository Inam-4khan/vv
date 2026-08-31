import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminAuthInstance: Auth | null = null;

export const getAdminAuth = (): Auth => {
  if (!adminAuthInstance) {
    if (!getApps().length) {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'atlantean-genre-8t8c4',
      });
    }
    adminAuthInstance = getAuth();
  }
  return adminAuthInstance;
};

export const adminAuth = {
  verifyIdToken: async (token: string) => {
    return getAdminAuth().verifyIdToken(token);
  }
};

