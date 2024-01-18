"use client";

import { styled } from '@linaria/react';
import SNSLinks from '@/app/_components/Header/SNSLinks';
import Image from 'next/image';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  width: 100%;
  padding-bottom: 1.5rem;
  //border-bottom: 1px solid var(--border-color);
  position: relative;
  
  //:after {
  //  position: absolute;
  //  content: '';
  //  width: 100%;
  //  height: 1px;
  //  border-bottom: 1px dashed var(--border-color);
  //  bottom: -5px;
  //  left: 0;
  //}

  @media (max-width: 599px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding-top: 2rem;
  }
`;

const HeaderWrapper = styled.div`
  cursor: pointer;
`;

const Title = styled.p`
  color: var(--foreground-sub-color);
  font-size: 1.0rem;
  margin: 8px 0 0;
  font-weight: normal;

  @media (max-width: 599px) {
    text-align: center;
  }
`;

export default function Header() {
  return (
    <Wrapper>
      <HeaderWrapper role={"button"} onClick={() => location.href = '/'}>
        <Image src={'logo.svg'} width={200} height={50} alt={'logo'} />
        <Title>いつでぶ</Title>
      </HeaderWrapper>
      <SNSLinks />
    </Wrapper>
  )
}