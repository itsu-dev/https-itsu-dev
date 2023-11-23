import { styled } from '@linaria/react';
import Overview from '@/app/_components/Introduction/Overview';
import RSSFeeds from '@/app/_components/Introduction/RSSFeeds';

const Wrapper = styled.article`
  display: grid;
  column-gap: 2rem;
  grid-template-columns: 350px 1fr;
  margin-top: 3rem;
  
  & > section {
    width: 100%;
  }
`;

export default function Introduction() {
  return (
    <Wrapper>
      <Overview />
      <RSSFeeds />
    </Wrapper>
  )
}