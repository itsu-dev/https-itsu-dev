type Result<T> =
  {
    success: true,
    result: T;
  }
  | {
    success: false,
  };

type FeedType = 'Zenn' | 'Qiita' | 'note';

type RSSFeed = {
  type: FeedType;
  title: string;
  url: string;
  unixTime: number;
}