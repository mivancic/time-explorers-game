import audioService from '../services/AudioService';

// Mock Audio class
global.Audio = class {
  constructor(src) {
    this.src = src;
    this.volume = 1;
    this.currentTime = 0;
    this.play = jest.fn().mockResolvedValue();
  }
};

describe('AudioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    audioService.sounds = {};
    audioService.enabled = true;
    audioService.volume = 0.8;
    audioService.initialized = false;
  });

  test('initializes with sound files', async () => {
    const result = await audioService.init();
    
    expect(result).toBe(true);
    expect(audioService.initialized).toBe(true);
    expect(Object.keys(audioService.sounds).length).toBeGreaterThan(0);
    expect(audioService.sounds.success).toBeDefined();
    expect(audioService.sounds.error).toBeDefined();
  });

  test('plays a sound effect', async () => {
    await audioService.init();
    
    const result = audioService.play('success');
    
    expect(result).toBe(true);
    expect(audioService.sounds.success.play).toHaveBeenCalled();
    expect(audioService.sounds.success.currentTime).toBe(0); // Should reset time
  });

  test('does not play sounds when disabled', async () => {
    await audioService.init();
    audioService.enabled = false;
    
    const result = audioService.play('success');
    
    expect(result).toBe(false);
    expect(audioService.sounds.success.play).not.toHaveBeenCalled();
  });

  test('handles non-existent sound effects', async () => {
    await audioService.init();
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = audioService.play('nonexistent');
    
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('enables and disables sounds', async () => {
    await audioService.init();
    
    audioService.setEnabled(false);
    expect(audioService.enabled).toBe(false);
    
    audioService.setEnabled(true);
    expect(audioService.enabled).toBe(true);
  });

  test('sets volume for all sounds', async () => {
    await audioService.init();
    
    // Set volume to 0.5
    audioService.setVolume(0.5);
    expect(audioService.volume).toBe(0.5);
    
    // All sounds should have 0.5 volume
    Object.values(audioService.sounds).forEach(sound => {
      expect(sound.volume).toBe(0.5);
    });
    
    // Test volume limits
    audioService.setVolume(1.5); // Above max
    expect(audioService.volume).toBe(1);
    
    audioService.setVolume(-0.5); // Below min
    expect(audioService.volume).toBe(0);
  });

  test('returns enabled status', async () => {
    await audioService.init();
    
    audioService.enabled = true;
    expect(audioService.isEnabled()).toBe(true);
    
    audioService.enabled = false;
    expect(audioService.isEnabled()).toBe(false);
  });

  test('returns current volume', async () => {
    await audioService.init();
    
    audioService.volume = 0.75;
    expect(audioService.getVolume()).toBe(0.75);
  });
}); 