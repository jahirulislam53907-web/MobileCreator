import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SyncableData {
  bookmarks: Array<{ surah: number; ayah: number; timestamp: string }>;
  preferences: Record<string, any>;
  lastRead: { surah: number; ayah: number; timestamp: string };
}

export interface SyncStatus {
  lastSyncTime: string | null;
  isSyncing: boolean;
  pendingChanges: number;
  lastError: string | null;
}

class OfflineSyncManager {
  private syncStatus: SyncStatus = {
    lastSyncTime: null,
    isSyncing: false,
    pendingChanges: 0,
    lastError: null
  };

  private pendingQueue: Array<{ type: string; data: any; timestamp: string }> = [];

  async initSync(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('sync_status');
      if (stored) {
        this.syncStatus = JSON.parse(stored);
      }

      const queue = await AsyncStorage.getItem('pending_queue');
      if (queue) {
        this.pendingQueue = JSON.parse(queue);
        this.syncStatus.pendingChanges = this.pendingQueue.length;
      }
    } catch (error) {
      console.error('Error initializing sync:', error);
    }
  }

  async addToSyncQueue(type: string, data: any): Promise<void> {
    try {
      const item = {
        type,
        data,
        timestamp: new Date().toISOString()
      };

      this.pendingQueue.push(item);
      this.syncStatus.pendingChanges = this.pendingQueue.length;

      await AsyncStorage.setItem('pending_queue', JSON.stringify(this.pendingQueue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  async syncWithServer(serverUrl: string, userId: string): Promise<boolean> {
    try {
      this.syncStatus.isSyncing = true;

      if (this.pendingQueue.length === 0) {
        this.syncStatus.isSyncing = false;
        return true;
      }

      const response = await fetch(`${serverUrl}/api/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          changes: this.pendingQueue
        })
      });

      if (!response.ok) throw new Error('Sync failed');

      const result = await response.json();

      // Clear queue after successful sync
      this.pendingQueue = [];
      this.syncStatus.pendingChanges = 0;
      this.syncStatus.lastSyncTime = new Date().toISOString();
      this.syncStatus.lastError = null;

      await AsyncStorage.setItem('pending_queue', JSON.stringify(this.pendingQueue));
      await this.saveSyncStatus();

      return true;
    } catch (error) {
      this.syncStatus.lastError = error instanceof Error ? error.message : 'Unknown error';
      await this.saveSyncStatus();
      console.error('Sync error:', error);
      return false;
    } finally {
      this.syncStatus.isSyncing = false;
    }
  }

  private async saveSyncStatus(): Promise<void> {
    try {
      await AsyncStorage.setItem('sync_status', JSON.stringify(this.syncStatus));
    } catch (error) {
      console.error('Error saving sync status:', error);
    }
  }

  getSyncStatus(): SyncStatus {
    return this.syncStatus;
  }

  async clearSyncQueue(): Promise<void> {
    this.pendingQueue = [];
    this.syncStatus.pendingChanges = 0;
    await AsyncStorage.setItem('pending_queue', JSON.stringify(this.pendingQueue));
  }
}

export const offlineSyncManager = new OfflineSyncManager();
