'use client';

import { styled } from '@linaria/react';
import Section from '@/app/_components/common/Section';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import useOekakiHelper from '@/app/_hooks/useOekakiHelper';
import { IconBrush, IconClock, IconMessage, IconUser } from '@tabler/icons-react';
import { COLOR_PALETTE, DRAWING_COUNT_LIMIT, DRAWING_TIME_LIMIT, IMAGE_SIZE } from '@/app/_consts/oekaki';
import Image from 'next/image';

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

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CanvasWrapper = styled.div`
  margin-top: 0.8rem;
  position: relative;
`;

const Loader = styled.div`
  position: absolute;
  z-index: 1;
  top: 100px;
  left: 100px;
`;

const Canvas = styled.canvas`
  border: 1px solid var(--border-color);
  image-rendering: pixelated;
  touch-action: none;
`;

const FlexWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.0rem;
`;

const MeterWrapper = styled(FlexWrapper)`
  margin-top: 0.5rem;
`;

const Meter = styled.div<{value: number, max: number}>`
  flex: 1;
  margin-top: 0;
  padding-top: 0;
  border: none;
  height: 1.0rem;
  border-radius: 6px;
  position: relative;
  background-color: #cccccc;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => `${(props.value / props.max) * 100}%`};
    height: 1.0rem;
    border-radius: 6px;
    background-color: ${(props) => `${(props.value / props.max) * 100 > 30 ? '#3aba73' : '#ff5656'}`};
  }
`;

const NoInk = styled.p`
  margin: 1px 0;
`;

const StatusWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;

  @media (max-width: 599px) {
    flex-direction: column;
    gap: 16px;
    justify-content: center;
  }
`;

const BrushesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  background-color: #cccccc;
  padding: 2px 8px;
  border-radius: var(--border-radius);
`;

const ColorChooserWrapper = styled(FlexWrapper)`
  width: auto;
`;

const ChooseColorButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.75rem;
  border: 3px solid transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FinishButton = styled.button`
  width: 100%;
  margin-top: 1.0rem;
  border: none;
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 0;
  border-radius: var(--border-radius);
  transition: all .3s;
  cursor: pointer;

  :hover {
    filter: brightness(0.85);
  }
`;

const Attention = styled.p`
  color: var(--foreground-sub-color);
  font-size: 0.7rem;
  margin: 0.5rem 0 0;
`;

const Input = styled.input`
  width: 100%;
  font-size: 1.0rem;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin: 1rem 0 0;
  padding: 4px 16px;
  outline: none;

  :focus {
    outline: none;
    border: 2px solid var(--color-primary);
  }
`;

const Description = styled.div`
  width: 100%;
  margin-top: 0.5rem;
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

export default function ImageDrawer({ imageId }: { imageId: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [histories, setHistories] = useState<OekakiHistory[] | null>();

  const {
    onMouseDown,
    onMouseMove,
    finalize,
    setCanvas,
    setColor,
    setDescription,
    setAuthor,
    timer,
    drawCount,
    color,
    description,
    author,
    initialized,
    masterImage,
  } = useOekakiHelper(imageId);

  useLayoutEffect(() => {
    setCanvas(ref.current!);
  }, [setCanvas]);

  useEffect(() => {
    if (!imageId) {
      setHistories([]);
      return;
    }

    (async () => {
      const historiesResponse = await fetch(`https://itsu-dev-oekaki.itsu020402.workers.dev/api/oekaki/histories?image_id=${imageId}`);
      if (!historiesResponse.ok) {
        alert('エラーが発生しました...');
        return;
      }

      const json = await historiesResponse.json() as Result<OekakiHistory[]>;
      if (!json.success) {
        alert('エラーが発生しました...');
        return;
      }

      setHistories(json.result);
    })();
  }, [imageId]);

  const onFinishClick = useCallback(() => {
    (async () => {
      if (!sending) {
        setSending(true);
        await finalize();
        setSending(false);
      }
    })();
  }, [finalize, sending]);

  return (
    <Wrapper>
      <Section>
        <h2>おえかきする</h2>
        <ContentWrapper>
          { masterImage &&
            <Description>
              <DescriptionHeader>
                <IconUser size={'1.2rem'} color={'var(--foreground-sub-color)'} />
                <span>{masterImage.author}@{masterImage.ip}</span>
              </DescriptionHeader>
            </Description>
          }
          {masterImage && masterImage.description &&
            <Description>
              <DescriptionHeader>
                <IconMessage size={'1.2rem'} color={'var(--foreground-sub-color)'} />
                <span>{masterImage.description}</span>
              </DescriptionHeader>
            </Description>
          }
          <CanvasWrapper>
            <Canvas ref={ref} width={IMAGE_SIZE} height={IMAGE_SIZE} onPointerDown={onMouseDown}
                    onPointerMove={onMouseMove} />
            {!initialized &&
              <Loader>
                <Image src={'loader.svg'} alt={'loading icon'} width={100} height={100} />
              </Loader>
            }
          </CanvasWrapper>
          <MeterWrapper>
            {drawCount < DRAWING_COUNT_LIMIT &&
              <>
                <IconClock size={'1.5rem'} color={timer !== 0 ? 'var(--foreground-sub-color)' : '#ff5656'} />
                <Meter max={DRAWING_TIME_LIMIT} value={timer} />
              </>
            }
            {drawCount >= DRAWING_COUNT_LIMIT &&
              <NoInk>あーあ、筆のインクが無くなってしまいました...</NoInk>
            }
          </MeterWrapper>
          <StatusWrapper>
            <ColorChooserWrapper>
              {Object.keys(COLOR_PALETTE).filter((key) => key !== '255,255,255').map((c, index) =>
                <ChooseColorButton key={index} style={{
                  backgroundColor: `rgb(${c})`,
                  border: color === `rgb(${c})` ? '3px solid var(--border-color)' : '3px solid transparent',
                }} onClick={() => setColor(`rgb(${c})`)} />,
              )}
            </ColorChooserWrapper>
            <BrushesWrapper>
              <IconBrush size={'1.2rem'} color={color} />
              <span>×&nbsp;{DRAWING_COUNT_LIMIT - drawCount}</span>
            </BrushesWrapper>
          </StatusWrapper>
          <Input type={'text'} maxLength={20} placeholder={'なまえを入力（20文字まで）'}
                 onChange={(e) => setAuthor(e.target.value)} value={author} />
          {imageId.length === 0 &&
            <Input type={'text'} maxLength={20} placeholder={'お題を入力（20文字まで）'}
                   onChange={(e) => setDescription(e.target.value)} value={description} />}
          <FinishButton onClick={onFinishClick}>{sending ? '投稿中...' : 'かんせい'}</FinishButton>
          <Attention>投稿するとIPアドレスが公開されます</Attention>
        </ContentWrapper>
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