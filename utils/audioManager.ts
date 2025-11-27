import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AudioFile {
  surah: number;
  ayah: number;
  qari: string;
  url: string;
  duration: number;
  size: number;
  localPath?: string;
  isDownloaded: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentPosition: number;
  duration: number;
  playbackRate: number;
}

class AudioManager {
  private sound: Audio.Sound | null = null;
  private playbackState: PlaybackState = {
    isPlaying: false,
    currentPosition: 0,
    duration: 0,
    playbackRate: 1.0
  };

  async initAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
      });
    } catch (error) {
      console.error('Failed to set audio mode:', error);
    }
  }

  async playAudio(audioFile: AudioFile): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const source = audioFile.isDownloaded && audioFile.localPath
        ? { uri: audioFile.localPath }
        : { uri: audioFile.url };

      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
      this.sound = sound;
      this.playbackState.isPlaying = true;

      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        this.playbackState.duration = status.durationMillis || 0;
      }

      sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate.bind(this));
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  private onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      this.playbackState.currentPosition = status.positionMillis;
      this.playbackState.duration = status.durationMillis;
      this.playbackState.isPlaying = status.isPlaying;
    }
  }

  async pause(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
      this.playbackState.isPlaying = false;
    }
  }

  async resume(): Promise<void> {
    if (this.sound) {
      await this.sound.playAsync();
      this.playbackState.isPlaying = true;
    }
  }

  async setPlaybackRate(rate: number): Promise<void> {
    if (this.sound) {
      await this.sound.setRateAsync(rate, true);
      this.playbackState.playbackRate = rate;
    }
  }

  async seek(position: number): Promise<void> {
    if (this.sound) {
      await this.sound.setPositionAsync(position);
    }
  }

  async stop(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      this.playbackState.isPlaying = false;
      this.playbackState.currentPosition = 0;
    }
  }

  getPlaybackState(): PlaybackState {
    return this.playbackState;
  }

  async cleanup(): Promise<void> {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export const audioManager = new AudioManager();
