import { styled } from '@linaria/react';
import React from 'react';
import OsirifukiGraph from '@/app/_components/OsirifukiGraph';

const Wrapper = styled.main`
  width: 100%;
  padding: 2rem 10rem 0;
  
  @media (max-width: 599px) {
    padding: 2rem 4px;
  }
`;

const Status = styled.p<{ isAlive: boolean }>`
  margin-top: 0;
  font-size: 2.0rem;
  color: ${props => props.isAlive ? '#32a852' : '#a83232'};
`;

const Title = styled.h1`
  color: var(--foreground-sub-color);
  font-size: 1.0rem;
  font-weight: normal;
`;

const oshirifukiFetcher = async (): Promise<Result<OsirifukiResponse>> => {
  const res = await fetch('https://itsu-dev-osirifuki.itsu020402.workers.dev/api/osirifuki', { cache: 'no-cache' });
  if (!res.ok) {
    return { success: false };
  }

  return await res.json();
};

export default async function Osirifuki() {
  const osirifukiResponse = await oshirifukiFetcher();

  const isAlive = () => {
    if (!osirifukiResponse.success) {
      return false;
    }
    const date = new Date();
    const index = Math.floor((date.getHours() * 60 + date.getMinutes()) / 5);
    return osirifukiResponse.result.heartBeats[index] !== 0;
  };

  return (
    <Wrapper>
      <Title>現在の状況</Title>
      {osirifukiResponse.success && <Status isAlive={isAlive()}>{isAlive() ? '生きています' : 'すでに死亡しています'}</Status>}
      {!osirifukiResponse.success && <Status isAlive={false}>エラー</Status>}
      {osirifukiResponse.success &&
        <>
          <Title>今日の心拍数遷移</Title>
          <OsirifukiGraph data={osirifukiResponse.result} />
        </>
      }
    </Wrapper>
  );
}

export const runtime = 'edge';