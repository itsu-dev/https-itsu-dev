import { styled } from '@linaria/react';
import { SiAddthis } from '@icons-pack/react-simple-icons';
import Heading from '@/app/_components/common/Heading';
import { useCallback, useContext } from 'react';
import { OekakiContext } from '@/app/_contexts/OekakiContext';

const Wrapper = styled.article`
  width: 100%;
  animation: openAnimation .5s ease forwards;
  
  @keyframes openAnimation {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ListWrapper = styled.section`
  width: 100%;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15%, 1fr));
  grid-gap: 16px;
  justify-self: center;
  align-self: center;

  @media (max-width: 599px) {
    grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
  }

  @media (min-width: 599px) and (max-width: 1100px) {
    grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
  }
`;

const Card = styled.div`
  height: 0;
  padding-bottom: 100%;
  position: relative;
  cursor: pointer;
  transition: all .3s;
  border: 1px solid var(--border-color);
  
  :hover {
    scale: 1.03;
  }
`;

const CardInnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function ImageList() {
  const context = useContext(OekakiContext);
  const onClickCard = useCallback((imageId: string | null) => {
    context.setSelectedImageId(imageId);
    context.setState('draw');
  }, [context]);

  return (
    <Wrapper>
      <Heading as={'h2'}>描きたい絵を選ぶ</Heading>
      <ListWrapper>
        <Card>
          <CardInnerWrapper onClick={() => onClickCard(null)}>
            <SiAddthis color={'var(--color-primary)'} size={32} />
          </CardInnerWrapper>
        </Card>
        {new Array(20).fill(null).map((a, index) =>
          <Card key={index} role={'button'} onClick={() => onClickCard('test')}>
            <CardInnerWrapper>
              aaa
            </CardInnerWrapper>
          </Card>
        )}
      </ListWrapper>
    </Wrapper>
  )
}