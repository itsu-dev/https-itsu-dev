"use client";

import { styled } from '@linaria/react';
import useOekakiContext, { OekakiContext } from '@/app/_contexts/OekakiContext';
import OekakiComponent from '@/app/_components/OekakiComponent';
import Section from '@/app/_components/common/Section';
import { DRAWING_COUNT_LIMIT, DRAWING_TIME_LIMIT } from '@/app/_consts/oekaki';

const Main = styled.main`
  padding: 0 10rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;

  @media (max-width: 1100px) {
    padding: 2rem 24px;
  }
  
  h1 {
    width: 100%;
  }
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
    gap: 2rem;
  }
`;

const Description = styled.p`
  margin-top: 3px;
`;

export default function Oekaki() {
  const context = useOekakiContext();
  return (
    <Main>
      <h1>おえかき</h1>
      <ContentArea>
        <article>
          <Section>
            <Description>ほかの人が描いた絵を上書きしておもしろい絵を作ろう！</Description>
          </Section>
          <Section>
            <h2>ルール</h2>
            <ul>
              <li>1枚の絵につき{DRAWING_COUNT_LIMIT}筆まで描くことができます</li>
              <li>ただし、1筆につき{DRAWING_TIME_LIMIT / 1000}秒までしか描くことができません</li>
              <li>いちど描いたらもとに戻すことはできません</li>
              <li>ひとがいやな気持ちになることは描かないでください</li>
            </ul>
          </Section>
        </article>
        <OekakiContext.Provider value={context}>
          <OekakiComponent />
        </OekakiContext.Provider>
      </ContentArea>
    </Main>
  )
}