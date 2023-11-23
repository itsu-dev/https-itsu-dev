import { styled } from '@linaria/react';
import Header from '@/app/_components/Header';
import Introduction from '@/app/_components/Introduction';
import MarkdownSection from '@/app/_components/common/MarkdownSection';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 6rem 10rem 0;
  max-width: var(--max-width);
  
  & > article {
    width: 100%;
  }
`;

const ContentsWrapper = styled.article`
  max-width: var(--max-width);
  width: 100%;
  padding: 2rem 10rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
`;

export default function Home() {
  return (
    <>
      <Main>
        <Header />
        <Introduction />
      </Main>
      <ContentsWrapper>
        <MarkdownSection fileUrl={'past_affiliations.md'} />
        <MarkdownSection fileUrl={'works.md'} />
      </ContentsWrapper>
    </>
  );
}
