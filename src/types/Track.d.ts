interface Track {
  title: string;
  url: string; // OriginURL
  platform: "youtube" | "spotify" | string;
  thumbnail: string;
  uploader: string;
  uploaderId: string;
  id: string; // UUID;
  download: boolean;
  like: boolean | null;
  playCount: number;
}

interface QueueTrack extends Track {
  time: string;
}
