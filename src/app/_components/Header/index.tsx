import { styled } from '@linaria/react';
import SNSLinks from '@/app/_components/Header/SNSLinks';
import Image from 'next/image';
import Link from 'next/link';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  width: 100%;
  padding-bottom: 1.5rem;
  position: relative;

  @media (max-width: 599px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding-top: 2rem;
  }
`;

const HeaderWrapper = styled(Link)`
  cursor: pointer;
  display: block;
  border: none;
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
      <HeaderWrapper href={'/'}>
        <Image src={'logo.svg'} width={200} height={50} alt={'logo'} />
        <Title>いつでぶ</Title>
      </HeaderWrapper>
      <SNSLinks />
    </Wrapper>
  )
}