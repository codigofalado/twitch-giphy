type GiphyRating = 'y' | 'g' | 'pg' | 'pg-13' | 'r';

export interface Configuration {
  twitch: {
    username: string;
    token: string;
    channels: string[];
  };
  giphy: {
    token: string;
    rating: GiphyRating;
  };
}
