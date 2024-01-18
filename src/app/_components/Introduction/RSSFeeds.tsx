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
    padding-top: 20px; 
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
  padding-bottom: 4px;
`;

const TitleLink = styled(Link)`
  transition: 0.6s all;
  position: relative;
  
  &:hover {
    padding-left: 1.5rem;
  }

  &:hover::before {
    content: '▶';
    position: absolute;
    font-size: 0.7rem;
    top: 0.35rem;
    left: 0.2rem;
  }
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
      <Heading as={'h1'} baseFontSize={1.8}>書いた記事など</Heading>
      <Feeds>
        {feeds && feeds.success && feeds.result.map((feed, index) =>
          <FeedWrapper key={index}>
            <Description>
              {getIcon(feed.type)}<span>{feed.type}</span><span>{new Date(feed.unixTime).toLocaleDateString('ja-JP', {
              year: 'numeric', month: '2-digit',
              day: '2-digit',
            })}</span>
            </Description>
            <TitleLink href={feed.url}>{feed.title}</TitleLink>
          </FeedWrapper>,
        )}
      </Feeds>
    </Section>
  );
}