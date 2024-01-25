import RSSParser from '@/app/_utils/RSSParser';

export default async function parseFeeds(feeds: Record<string, string>): Promise<Result<RSSResult[]>> {
  const result: RSSResult[] = [];

  for await (const [type, xml] of Object.entries(feeds)) {
    const parser = new RSSParser();
    const rssFeed = await parser.parseString(xml);

    if (!rssFeed?.items) {
      return { success: false };
    }

    rssFeed.items.forEach((item: RSSItem) =>
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