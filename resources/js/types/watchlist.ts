export type WatchlistItem = {
    id: number;
    title: string;
    year: number | null;
    score: string;
    genre: string;
    type: 'film' | 'serial';
    poster: string | null;
};

export type WatchlistMedia = WatchlistItem;
