import feeds from '@/app/_consts/feeds';
import Parser from 'rss-parser';

export default async function parseFeeds(): Promise<Result<RSSFeed[]>> {
  const result: RSSFeed[] = [];

  await Promise.all(feeds.map((feed) => (async () => {
    const parser = new Parser();
    const rssFeed = await parser.parseURL(feed[0]);
    rssFeed.items.forEach((item) =>
      result.push({
        type: feed[1],
        title: item.title ?? '',
        url: item.link ?? '',
        unixTime: new Date(item.pubDate ?? '').getTime(),
      }),
    );
  })()));

  return { success: true, result: result.sort((a, b) => a.unixTime - b.unixTime > 0 ? -1 : 1) };
}