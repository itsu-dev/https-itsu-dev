'use client';

import { useContext } from 'react';
import { OekakiContext } from '@/app/_contexts/OekakiContext';
import ImageList from '@/app/_components/OekakiComponent/ImageList';
import { styled } from '@linaria/react';
import ImageDrawer from '@/app/_components/OekakiComponent/ImageDrawer';

const Wrapper = styled.div`
  width: 100%;
`;

export default function OekakiComponent() {
  const context = useContext(OekakiContext);

  return (
    <Wrapper>
      {
        (() => {
          switch (context.state) {
            case 'select':
              return <ImageList />;
            case 'draw':
              return <ImageDrawer />
            default:
              return null;
          }
        })()
      }
    </Wrapper>
  );
}