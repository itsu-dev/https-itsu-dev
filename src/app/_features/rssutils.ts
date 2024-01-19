import Parser from 'rss-parser';

export default async function parseFeeds(feeds: Record<string, string>): Promise<Result<RSSFeed[]>> {
  const result: RSSFeed[] = [];

  for await (const [type, xml] of Object.entries(feeds)) {
    const parser = new Parser();
    const rssFeed = await parser.parseString(xml);
    rssFeed.items.forEach((item) =>
      result.push({
        type: type as FeedType,
        title: item.title ?? '',
        url: item.link ?? '',
        unixTime: new Date(item.pubDate ?? '').getTime(),
      }),
    );
  }

  return { success: true, result: result.sort((a, b) => a.unixTime - b.unixTime > 0 ? -1 : 1) };
}