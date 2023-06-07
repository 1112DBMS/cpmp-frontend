export const createSession = (
  track: Track,
  handlePlay: () => void,
  handleNext: () => void
) => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.uploader,
      album: "CPMP",
      artwork: [
        {
          src: `/public/${track.thumbnail}`,
          sizes: "640x480",
          type: "image/png",
        },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => handlePlay());
    navigator.mediaSession.setActionHandler("pause", () => handlePlay());
    navigator.mediaSession.setActionHandler("nexttrack", () => handleNext());
  }
};

export const updateSession = (duration: number, position: number) => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.setPositionState({
      duration: duration,
      position: position,
    });
  }
};
