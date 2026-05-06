/**
 * Audio and Haptic Utilities for NEURO-FLOW OS
 * Generates sounds programmatically using Web Audio API
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (typeof window === "undefined") return null as any;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Triggers mobile haptic feedback
 */
export function triggerHaptic(style: "light" | "medium" | "heavy" | "success" | "error" = "light"): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    switch (style) {
      case "light":
        navigator.vibrate(10);
        break;
      case "medium":
        navigator.vibrate(20);
        break;
      case "heavy":
        navigator.vibrate([30, 20, 30]);
        break;
      case "success":
        navigator.vibrate([10, 50, 10]);
        break;
      case "error":
        navigator.vibrate([50, 100, 50, 100, 50]);
        break;
    }
  }
}

/**
 * Plays a short "blip" sound
 */
export function playBlip(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
    
    triggerHaptic("light");
  } catch (e) {
    console.warn("Audio Context failure:", e);
  }
}

/**
 * Plays a short "chirp" sound
 */
export function playChirp(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "square";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
    
    triggerHaptic("medium");
  } catch (e) {
    console.warn("Audio Context failure:", e);
  }
}

/**
 * Plays a short mechanical click sound
 */
export function playMechanicalClick(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      // Layer 1: Sharp click (noise burst)
      const bufferSize = ctx.sampleRate * 0.03;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8);
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.value = 2000;

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(ctx.currentTime);

      // Layer 2: Low thud
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.3, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);

      // Layer 3: High metallic ping
      const ping = ctx.createOscillator();
      ping.type = "square";
      ping.frequency.setValueAtTime(4200, ctx.currentTime);
      ping.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.02);

      const pingGain = ctx.createGain();
      pingGain.gain.setValueAtTime(0.08, ctx.currentTime);
      pingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      ping.connect(pingGain);
      pingGain.connect(ctx.destination);
      ping.start(ctx.currentTime);
      ping.stop(ctx.currentTime + 0.05);

      triggerHaptic("light");
      setTimeout(resolve, 120);
    } catch {
      resolve();
    }
  });
}

/**
 * Plays a system boot-up sequence sound
 */
export function playBootSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Ascending tones
    const frequencies = [200, 400, 600, 800];
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
    
    triggerHaptic("success");
  } catch {
    // Silent fallback
  }
}

/**
 * Plays a success/access-granted chime
 */
export function playAccessGrantedSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Two-note ascending chime
    const notes = [523.25, 783.99]; // C5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
    
    triggerHaptic("success");
  } catch {
    // Silent fallback
  }
}

/**
 * Speaks the AI greeting using Web Speech Synthesis API
 */
export function speakGreeting(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 0.85;
    utterance.volume = 0.9;

    // Try to get a female English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        (v.name.includes("Google") && v.name.includes("Female")) ||
        v.name.includes("Samantha") ||
        v.name.includes("Zira") ||
        v.name.includes("Microsoft Zira") ||
        (v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
    );
    const fallbackEnglish = voices.find((v) => v.lang.startsWith("en"));

    if (preferred) {
      utterance.voice = preferred;
    } else if (fallbackEnglish) {
      utterance.voice = fallbackEnglish;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    // Small delay to let audio context settle
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 300);

    // Timeout fallback
    setTimeout(resolve, 8000);
  });
}

/**
 * Preload speech synthesis voices (must be called on user interaction)
 */
export function preloadVoices(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }
}
