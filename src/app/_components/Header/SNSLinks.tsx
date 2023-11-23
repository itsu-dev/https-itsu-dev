import { styled } from '@linaria/react';
import { SiGithub, SiQiita, SiTwitter, SiZenn } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const SNSButton = styled(Link)`
  background-color: transparent;
  padding: 8px;
  border-radius: 8px;
  border: none;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background-color: #22222222;
  }
`;

export default function SNSLinks() {
  return (
    <Wrapper>
      <SNSButton href={'https://x.com/chururi_'}>
        <SiTwitter color={'var(--color-twitter)'} size={24} />
      </SNSButton>
      <SNSButton href={'https://github.com/itsu-dev'}>
        <SiGithub color={'var(--color-github)'} size={24} />
      </SNSButton>
      <SNSButton href={'https://zenn.dev/itsu_dev'}>
        <SiZenn color={'var(--color-zenn)'} size={24} />
      </SNSButton>
      <SNSButton href={'https://qiita.com/chururi'}>
        <SiQiita color={'var(--color-qiita)'} size={24} />
      </SNSButton>
    </Wrapper>
  );
}
