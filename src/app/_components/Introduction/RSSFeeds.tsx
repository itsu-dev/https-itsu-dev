import Heading from '@/app/_components/common/Heading';
import parseFeeds from '@/app/_features/rssutils';
import { styled } from '@linaria/react';
import Link from 'next/link';
import { SiQiita, SiZenn } from '@icons-pack/react-simple-icons';
import Section from '@/app/_components/common/Section';

const Feeds = styled.div`
  width: 100%;
  margin-top: 12px;
  
  div + div {
    padding-top: 16px; 
  }
`;

const FeedWrapper = styled.div`
  width: 100%;
  font-size: 1.1rem;
`;

const Description = styled.p`
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
`;


export default async function RSSFeeds() {
  const feeds = await parseFeeds();

  const getIcon = (type: FeedType) => {
    switch (type) {
      case 'Zenn':
        return <SiZenn size={12} color={'var(--color-zenn)'} />;
      case 'Qiita':
        return <SiQiita size={12} color={'var(--color-qiita)'} />;
      default:
        return null;
    }
  };

  return (
    <Section>
      <Heading as={'h1'}>書いた記事など</Heading>
      <Feeds>
        {feeds && feeds.success && feeds.result.map((feed, index) =>
          <FeedWrapper key={index}>
            <Description>
              {getIcon(feed.type)}<span>{feed.type}</span><span>{new Date(feed.unixTime).toLocaleDateString('ja-JP', {
              year: 'numeric', month: '2-digit',
              day: '2-digit',
            })}</span>
            </Description>
            <Link href={feed.url}>{feed.title}</Link>
          </FeedWrapper>,
        )}
      </Feeds>
    </Section>
  );
}