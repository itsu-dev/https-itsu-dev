import { styled } from '@linaria/react';
import Image from 'next/image';
import Heading from '@/app/_components/common/Heading';
import Link from 'next/link';
import Section from '@/app/_components/common/Section';

const MyIconWrapper = styled.div`
  background-color: white;
  width: 350px;
  height: 350px;
  border-radius: 175px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all .8s;
  
  :hover {
    box-shadow: var(--shadow);
    transform: rotateY(360deg);
  }
`;

const Description = styled.p`
  color: var(--foreground-sub-color);
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;

const Content = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

const Affiliations = styled.ul`
  margin: 0;
  padding: 0;
  li {
    list-style-type: none;
  }
`;

export default function Overview() {
  return (
    <Section>
      <MyIconWrapper>
        <Image src={'icon.svg'} alt={'自分のアイコン'} width={350} height={350} />
      </MyIconWrapper>
      <Content>
        <Heading as={'h1'}>ちゅるり</Heading>
        <Description>たべることがすき</Description>
        <Affiliations>
          <li>筑波大学情報メディア創成学類3年</li>
          <li>
            <Link href={'https://www.stb.tsukuba.ac.jp/~zdk/ipc'}>筑波大学全代会
              情報処理推進特別委員会</Link>
          </li>
          <li>
            <Link href={'https://www.spookies.co.jp/'}>株式会社スプーキーズ（アルバイト）</Link>
          </li>
        </Affiliations>
      </Content>
    </Section>
  );
}