import { styled } from '@linaria/react';
import Section from '@/app/_components/common/Section';
import { useLayoutEffect, useRef } from 'react';
import useOekakiHelper from '@/app/_hooks/useOekakiHelper';
import { IconBrush, IconClock } from '@tabler/icons-react';
import { COLOR_PALETTE, DRAWING_COUNT_LIMIT, DRAWING_TIME_LIMIT } from '@/app/_consts/oekaki';

const Wrapper = styled.article`
  width: 100%;
  animation: openAnimation .5s ease forwards;

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

const CanvasWrapper = styled.div`
  width: 514px;
`;

const Canvas = styled.canvas`
  border: 1px solid var(--border-color);
  image-rendering: pixelated;
`;

const FlexWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.0rem;
`;

const Meter = styled.meter`
  flex: 1;
  margin-top: 0;
  padding-top: 0;

  ::-webkit-meter-bar {
    border: none;
    height: 1.0rem;
    border-radius: 0;
    padding-top: 0;
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
`;

const BrushesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const ColorChooserWrapper = styled(FlexWrapper)`
  width: auto;
  margin-top: 6px;
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

export default function ImageDrawer() {
  const ref = useRef<HTMLCanvasElement>(null);

  const { onMouseDown, onMouseMove, finalize, setCanvas, setColor, timer, drawCount, color } = useOekakiHelper();

  useLayoutEffect(() => {
    setCanvas(ref.current!);
  }, [setCanvas]);

  return (
    <Wrapper>
      <Section>
        <h2>おえかきする</h2>
        <CanvasWrapper>
          <Canvas ref={ref} width={512} height={512} onMouseDown={onMouseDown} onMouseMove={onMouseMove} />
          <FlexWrapper>
            {drawCount < DRAWING_COUNT_LIMIT &&
              <>
                <IconClock size={'1.5rem'} color={'var(--foreground-sub-color)'} />
                <Meter id={'remaining-time'} min={0} max={DRAWING_TIME_LIMIT} value={timer} />
              </>
            }
            {drawCount >= DRAWING_COUNT_LIMIT &&
              <NoInk>あーあ、筆のインクが無くなってしまいました...</NoInk>
            }
          </FlexWrapper>
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
              {new Array(DRAWING_COUNT_LIMIT - drawCount).fill(null).map((_, index) =>
                <IconBrush key={index} size={'1.5rem'} color={'var(--foreground-sub-color)'} />,
              )}
            </BrushesWrapper>
          </StatusWrapper>
          <FinishButton onClick={finalize}>かんせい</FinishButton>
        </CanvasWrapper>
      </Section>
    </Wrapper>
  );
}