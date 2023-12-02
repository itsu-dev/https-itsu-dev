import { styled } from '@linaria/react';
import OekakiComponent from '@/app/_components/OekakiComponent';
import Section from '@/app/_components/common/Section';
import { DRAWING_COUNT_LIMIT, DRAWING_TIME_LIMIT } from '@/app/_consts/oekaki';
import Link from 'next/link';

const Main = styled.main`
  padding: 2rem 10rem 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  
  @media (max-width: 599px) {
    padding: 2rem 4px;
  }

  @media (min-width: 599px) and (max-width: 1100px) {
    padding: 2rem 24px;
  }
  
  h1 {
    width: 100%;
  }
`;

const TopLink = styled.p`
  text-align: left;
  width: 100%;
  font-size: 0.8rem;
  margin-bottom: -1.0rem;
`;

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 2em;

  @media (max-width: 1100px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const Description = styled.p`
  margin-top: 3px;
`;

export default function Oekaki({searchParams}: {searchParams: {image_id?: string, gallery?: string}}) {
  return (
    <Main>
      <TopLink><Link href={'/oekaki'}>トップへ戻る</Link></TopLink>
      <h1>おえかき</h1>
      <ContentArea>
        <article>
          <Section>
            <Description>ほかの人が描いた絵を上書きしておもしろい絵を描こう！</Description>
          </Section>
          <Section>
            <h2>ルール</h2>
            <ul>
              <li>1枚の絵につき{DRAWING_COUNT_LIMIT}筆まで描くことができます</li>
              <li>ただし、1筆につき{DRAWING_TIME_LIMIT / 1000}秒までしか描くことができません</li>
              <li>いちど描いたらもとに戻すことはできません</li>
              <li>1枚の絵を最大10人で描くことができます</li>
              <li>ひとがいやな気持ちになることは描かないでください</li>
            </ul>
          </Section>
        </article>
        <OekakiComponent searchParams={searchParams} />
      </ContentArea>
    </Main>
  )
}