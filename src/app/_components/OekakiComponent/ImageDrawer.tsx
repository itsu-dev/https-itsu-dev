import { styled } from '@linaria/react';
import Section from '@/app/_components/common/Section';
import { useContext, useLayoutEffect, useRef } from 'react';
import useOekakiHelper from '@/app/_hooks/useOekakiHelper';
import { IconBrush, IconClock } from '@tabler/icons-react';
import { COLOR_PALETTE, DRAWING_COUNT_LIMIT, DRAWING_TIME_LIMIT } from '@/app/_consts/oekaki';
import { OekakiContext } from '@/app/_contexts/OekakiContext';

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

const MeterWrapper = styled(FlexWrapper)`
  margin-top: 6px;
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
  margin-top: 6px;
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

const DescriptionInput = styled.input`
  width: 100%;
  font-size: 1.0rem;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin: 0 0 1rem;
  padding: 4px 16px;
  outline: none;

  :focus {
    outline: none;
    border: 2px solid var(--color-primary);
  }
`;

export default function ImageDrawer() {
  const ref = useRef<HTMLCanvasElement>(null);
  const context = useContext(OekakiContext);

  const { onMouseDown, onMouseMove, finalize, setCanvas, setColor, timer, drawCount, color } = useOekakiHelper();

  useLayoutEffect(() => {
    setCanvas(ref.current!);
  }, [setCanvas]);

  return (
    <Wrapper>
      <Section>
        <h2>おえかきする</h2>
        <CanvasWrapper>
          {context.selectedImageId == null &&
            <DescriptionInput type={'text'} maxLength={20} placeholder={'説明を入力（任意、20文字まで）'}
                              onChange={(e) => context.setDescription(e.target.value)} value={context.description} />}
          <Canvas ref={ref} width={512} height={512} onMouseDown={onMouseDown} onMouseMove={onMouseMove} />
          <MeterWrapper>
            {drawCount < DRAWING_COUNT_LIMIT &&
              <>
                <IconClock size={'1.5rem'} color={'var(--foreground-sub-color)'} />
                <Meter id={'remaining-time'} min={0} max={DRAWING_TIME_LIMIT} value={timer} />
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
          <FinishButton onClick={finalize}>かんせい</FinishButton>
        </CanvasWrapper>
      </Section>
    </Wrapper>
  );
}