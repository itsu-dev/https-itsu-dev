'use client';

import { styled } from '@linaria/react';
import Image from 'next/image';
import Section from '@/app/_components/common/Section';
import { useEffect, useState } from 'react';
import { IconMessage } from '@tabler/icons-react';

const Wrapper = styled.article`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  animation: openAnimation .5s ease forwards;

  @media (max-width: 599px) {
    grid-template-columns: 1fr;
  }

  @keyframes openAnimation {
    from {
      transform: translateX(30px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  border: 1px solid var(--border-color);
  
  img {
    object-fit: contain;
    position: relative !important;
    width: 100% !important;

    @media (max-width: 599px) {
      width: 300px !important;
    }
  }
`;

const Description = styled.div`
  width: 100%;
  margin: 0.5rem 0;
`;

const DescriptionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  color: var(--foreground-sub-color);
`;

const HistoriesWrapper = styled.ul`
  margin-top: 1.1rem;
  padding: 0;
`;

const History = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  
  p {
    margin: 0;
  }
`;

const DateTime = styled.span`
  color: var(--foreground-sub-color);
  font-size: 0.7rem;
`;

const Attention = styled.p`
  color: var(--foreground-sub-color);
  font-size: 0.7rem;
  margin: 0.5rem 0 0;
  text-align: center;
`;

export default function ImageViewer({ imageId }: { imageId: string }) {
  const [masterImage, setMasterImage] = useState<OekakiImage | null>(null);
  const [histories, setHistories] = useState<OekakiHistory[] | null>();

  useEffect(() => {
    (async () => {
      const imageData = await fetch(`https://itsu-dev-oekaki.itsu020402.workers.dev/api/oekaki/image?image_id=${imageId}`);

      if (!imageData.ok) {
        alert('エラーが発生しました...');
        return;
      }

      const json = await imageData.json() as Result<OekakiImage>;
      if (!json.success) {
        alert('エラーが発生しました...');
        return;
      }

      setMasterImage(json.result);

      const historiesResponse = await fetch(`https://itsu-dev-oekaki.itsu020402.workers.dev/api/oekaki/histories?image_id=${imageId}`);
      if (!historiesResponse.ok) {
        alert('エラーが発生しました...');
        return;
      }

      const historiesJson = await historiesResponse.json() as Result<OekakiHistory[]>;
      if (!historiesJson.success) {
        alert('エラーが発生しました...');
        return;
      }

      setHistories(historiesJson.result);
    })();

  }, [imageId]);

  return (
    <Wrapper>
      <Section>
        <h2>ギャラリー</h2>
        {masterImage && masterImage.description &&
          <Description>
            <DescriptionHeader>
              <IconMessage size={'1.2rem'} color={'var(--foreground-sub-color)'} />
              <span>{masterImage.description}</span>
            </DescriptionHeader>
          </Description>
        }
        {masterImage &&
          <>
            <ImageWrapper>
              <Image src={`https://i.imgur.com/${masterImage.imgurId}.jpg`} alt={'oekaki image'} layout={'cover'} fill />
            </ImageWrapper>
            <Attention>右クリックまたは長押しで保存できます</Attention>
          </>
        }
      </Section>
      {histories != null &&
        <Section>
          <h3>今まで描いた方々</h3>
          {histories.length !== 0 &&
            <HistoriesWrapper>
              {histories.map((history, index) =>
                <History key={index}>
                  <div>
                    <p>{history.author}@{history.ip}</p>
                    <DateTime>
                      {new Date(history.created_at).toLocaleDateString()} {new Date(history.created_at).toLocaleTimeString()}
                    </DateTime>
                  </div>
                </History>
              )}
            </HistoriesWrapper>
          }
          {histories.length === 0 &&
            <p>まだ誰も描いていません</p>
          }
        </Section>
      }
    </Wrapper>
  );
}