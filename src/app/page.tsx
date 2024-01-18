import { styled } from '@linaria/react';
import Header from '@/app/_components/Header';
import Introduction from '@/app/_components/Introduction';
import MarkdownSection from '@/app/_components/common/MarkdownSection';
import SpotifyPlayer from '@/app/_components/Header/SpotifyPlayer';

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 6rem 10rem 0;
  
  & > article {
    width: 100%;
  }

  @media (max-width: 1100px) {
    padding: 2rem 24px;
  }
`;

const ContentsWrapper = styled.article`
  width: 100%;
  padding: 4rem 10rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 4rem;

  @media (max-width: 1100px) {
    padding: 0 24px;
  }

  @media (max-width: 599px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export default function Home({ searchParams }: { searchParams: Record<string, string | string[] | undefined>}) {
  console.log(searchParams);
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
      { searchParams.playSpotify != null && <SpotifyPlayer /> }
    </>
  );
}
