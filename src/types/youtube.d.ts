declare namespace YT {
  interface Player {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    destroy(): void;
    // Add other fields as needed
  }
  interface OnStateChangeEvent {
    data: number;
    target: Player;
  }
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
  }
}

interface Window {
  onYouTubeIframeAPIReady?: () => void;
  YT: {
    Player: {
      new (elementId: string, options: any): YT.Player;
    };
    PlayerState: typeof YT.PlayerState;
  };
}
