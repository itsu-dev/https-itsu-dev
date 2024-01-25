import {parseString} from 'xml2js';
import { promisify } from 'util';
export default class RSSParser {

  private options: RSSParserOptions;

  constructor(options: Partial<RSSParserOptions> = {}) {
    options.fetchOptions = options.fetchOptions || {};
    this.options = options as RSSParserOptions;
  }

  private parseRSS2(xml: any): RSSFeed {
    const channel = xml.rss.channel[0];
    return {
      title: channel.title[0] || undefined,
      link: channel.link[0] || undefined,
      description: channel.description[0] || undefined,
      items: (channel.item || []).map((item: any) => {
        return {
          title: item.title[0] || undefined,
          link: item.link[0] || undefined,
          description: item.description[0] || undefined,
          pubDate: item.pubDate[0] || undefined,
        };
      })
    };
  }

  private parseAtom(xml: any): RSSFeed {
    const feed = xml.feed;
    console.log(feed)
    const entries = feed.entry || [];
    return {
      title: feed.title[0] || undefined,
      link: feed.link[feed.link.length - 1] || undefined,
      description: feed.description[0] || undefined,
      items: entries.map((entry: any) => {
        return {
          title: entry.title[0] || undefined,
          link: entry.link[0].$.href || undefined,
          description: (entry.summary || [])[0] || undefined,
          pubDate: entry.updated || undefined,
        };
      })
    };
  }

  async parseString(xml: string): Promise<RSSFeed | undefined> {
    const _parseString = promisify(parseString);
    const doc: any = await _parseString(xml);

    switch (true) {
      case doc.feed != null:
        return this.parseAtom(doc);
      case doc.rss.$.version === '2.0':
        return this.parseRSS2(doc);
    }
  }

  async parseURL(url: string): Promise<RSSFeed | undefined> {
    const response = await fetch(url, this.options.fetchOptions);
    const xml = await response.text();
    return this.parseString(xml);
  }
}