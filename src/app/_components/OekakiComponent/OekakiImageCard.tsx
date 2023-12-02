'use client';

import React, { useCallback } from 'react';
import { styled } from '@linaria/react';
import { IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

type Props = {
  imageId: string;
  children: React.ReactNode;
  isCompleted?: boolean;
}

const Wrapper = styled.div<{ isCompleted: boolean }>`
  height: 0;
  padding-bottom: 100%;
  position: relative;
  cursor: pointer;
  transition: all .3s;
  border: ${props => props.isCompleted ? '3px solid #3aba73' : '1px solid var(--border-color)'};

  :hover {
    scale: 1.05;
  }
`;

const CheckWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #3aba73;
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

export default function OekakiImageCard({ imageId, children, isCompleted = false }: Props) {
  const router = useRouter();

  const next = useCallback((imageId: string) => {
    if (!isCompleted) {
      router.push(`/oekaki?image_id=${imageId}`);
    } else {
      router.push(`/oekaki?gallery=${imageId}`);
    }
  }, [isCompleted, router]);

  return (
    <Wrapper isCompleted={isCompleted}>
      <CardInnerWrapper onClick={() => next(imageId)}>
        {children}
      </CardInnerWrapper>
      {isCompleted &&
        <CheckWrapper>
          <IconCheck size={24} color={'white'} />
        </CheckWrapper>
      }
    </Wrapper>
  );
}