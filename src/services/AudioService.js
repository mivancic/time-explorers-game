/**
 * AudioService - A service for managing game audio and sound effects
 */
class AudioService {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.8; // Default volume (0-1)
    this.initialized = false;
  }

  /**
   * Initialize the audio service with sound files
   */
  async init() {
    if (this.initialized) return;

    try {
      // Define sound effects
      const soundEffects = {
        success: 'success.mp3',
        error: 'error.mp3',
        click: 'click.mp3',
        levelUp: 'level-up.mp3',
        timeOut: 'time-out.mp3',
        gameOver: 'game-over.mp3'
      };

      // Create audio objects for each sound
      for (const [key, file] of Object.entries(soundEffects)) {
        this.sounds[key] = new Audio(`/assets/audio/${file}`);
        this.sounds[key].volume = this.volume;
      }

      this.initialized = true;
      console.log('Audio service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }

  /**
   * Play a sound effect
   * @param {string} sound - The name of the sound to play
   * @returns {boolean} Success status
   */
  play(sound) {
    if (!this.enabled || !this.initialized) return false;

    try {
      const soundEffect = this.sounds[sound];
      if (!soundEffect) {
        console.warn(`Sound effect "${sound}" not found`);
        return false;
      }

      // Reset the audio to the beginning if it's already playing
      soundEffect.currentTime = 0;
      soundEffect.play().catch(error => {
        console.warn(`Error playing sound "${sound}":`, error);
      });
      
      return true;
    } catch (error) {
      console.error('Error playing sound:', error);
      return false;
    }
  }

  /**
   * Enable or disable all sounds
   * @param {boolean} isEnabled - Whether sounds should be enabled
   */
  setEnabled(isEnabled) {
    this.enabled = Boolean(isEnabled);
    return this.enabled;
  }

  /**
   * Set the volume for all sounds
   * @param {number} value - Volume value between 0 and 1
   */
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    
    // Update volume for all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
    
    return this.volume;
  }

  /**
   * Check if sounds are enabled
   * @returns {boolean} Whether sounds are enabled
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Get the current volume
   * @returns {number} Current volume (0-1)
   */
  getVolume() {
    return this.volume;
  }
}

// Create and export a singleton instance
const audioService = new AudioService();
export default audioService; 