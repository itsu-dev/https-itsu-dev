type Result<T> =
  {
    success: true,
    result: T;
  }
  | {
    success: false,
  };

type FeedType = 'Zenn' | 'Qiita' | 'note';

type RSSResult = {
  type: FeedType;
  title: string;
  url: string;
  unixTime: number;
}

type OekakiImage = {
  id: string;
  author: string;
  ip: string;
  created_at: number;
  imgurId: string;
  description?: string;
  payload?: number[];
  count: number;
  type: 'bin' | 'jpg';
}

type OekakiHistory = {
  id: string;
  author: string;
  ip: string;
  created_at: number;
}

type OsirifukiResponse = {
  heartBeats: number[];
  updatedAt: number;
}

type RSSParserOptions = {
  fetchOptions: any;
}

type RSSFeed = Partial<{
  title: string;
  link: string;
  description: string;
  items: RSSItem[];
}>;

type RSSItem = Partial<{
  title: string;
  link: string;
  description: string;
  pubDate: string;
}>;