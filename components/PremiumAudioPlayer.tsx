import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';

interface PremiumAudioPlayerProps {
  surah: number;
  ayah: number;
  qari?: string;
  isPlaying: boolean;
  currentPosition: number;
  duration: number;
  playbackRate: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (position: number) => void;
  onRateChange: (rate: number) => void;
}

export const PremiumAudioPlayer = ({
  surah,
  ayah,
  qari = 'Abdul Basit',
  isPlaying,
  currentPosition,
  duration,
  playbackRate,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onRateChange
}: PremiumAudioPlayerProps) => {
  const { theme } = useAppTheme();
  const [showRateMenu, setShowRateMenu] = useState(false);
  
  const playbackRates = [0.75, 1.0, 1.25, 1.5, 2.0];
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentPosition / duration) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.primary + '15' }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.surahInfo}>
          সূরা {surah} • আয়াত {ayah}
        </ThemedText>
        <ThemedText style={styles.qariName}>{qari}</ThemedText>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Pressable
          style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}
          onPress={(e) => {
            const layout = e.currentTarget;
            const width = layout.offsetWidth;
            const x = e.nativeEvent.locationX;
            const newPosition = (x / width) * duration;
            onSeek(newPosition);
          }}
        >
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.primary, width: `${progress}%` }
            ]}
          />
        </Pressable>
        <View style={styles.timeInfo}>
          <ThemedText style={styles.timeText}>{formatTime(currentPosition)}</ThemedText>
          <ThemedText style={styles.timeText}>{formatTime(duration)}</ThemedText>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable onPress={onPrevious} style={styles.controlBtn}>
          <Feather name="skip-back" size={20} color={theme.primary} />
        </Pressable>

        <Pressable
          onPress={isPlaying ? onPause : onPlay}
          style={[styles.playBtn, { backgroundColor: theme.primary }]}
        >
          <Feather
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color="white"
          />
        </Pressable>

        <Pressable onPress={onNext} style={styles.controlBtn}>
          <Feather name="skip-forward" size={20} color={theme.primary} />
        </Pressable>
      </View>

      {/* Speed Control */}
      <View style={styles.speedControl}>
        <Pressable
          style={[styles.speedBtn, { borderColor: theme.primary }]}
          onPress={() => setShowRateMenu(!showRateMenu)}
        >
          <ThemedText style={{ color: theme.primary, fontWeight: '600' }}>
            {playbackRate}x
          </ThemedText>
        </Pressable>

        {showRateMenu && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.rateMenu}
          >
            {playbackRates.map((rate) => (
              <Pressable
                key={rate}
                style={[
                  styles.rateOption,
                  rate === playbackRate && { backgroundColor: theme.primary }
                ]}
                onPress={() => {
                  onRateChange(rate);
                  setShowRateMenu(false);
                }}
              >
                <ThemedText
                  style={{
                    color: rate === playbackRate ? 'white' : theme.text,
                    fontWeight: '600'
                  }}
                >
                  {rate}x
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md
  },
  header: {
    marginBottom: Spacing.md
  },
  surahInfo: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4
  },
  qariName: {
    fontSize: 12,
    opacity: 0.7
  },
  progressContainer: {
    marginBottom: Spacing.lg
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.sm,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 2
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timeText: {
    fontSize: 11,
    opacity: 0.6
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg
  },
  controlBtn: {
    padding: Spacing.sm
  },
  playBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  speedControl: {
    alignItems: 'center'
  },
  speedBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1
  },
  rateMenu: {
    marginTop: Spacing.sm
  },
  rateOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#e0e0e0'
  }
});
