import { styled } from '@linaria/react';
import Link from 'next/link';
import { IconX } from '@tabler/icons-react';

const Wrapper = styled.div`
  @keyframes fadeIn {
    from {
      opacity: 0;
      bottom: 0;
    }
    to {
      opacity: 1;
      bottom: 1rem;
    }
  }
  
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1;
  animation: fadeIn 0.8s ease forwards;
  box-shadow: 0 0 15px -5px #777777;
  background-color: transparent;
  border-radius: 12px;
  height: 352px;
`;

const CloseButton = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 4px 4px 2px;
  border-radius: 12px 0 0 0;
  transition: all .3s;
  color: #ffffff;
  
  :hover {
    background-color: #22222222;
  }
`;

export default function SpotifyPlayer() {
  return (
    <Wrapper>
      <CloseButton href={'/'}>
        <IconX color={'white'} size={24} />
      </CloseButton>
      <iframe src="https://open.spotify.com/embed/artist/4QvgGvpgzgyUOo8Yp8LDm9?utm_source=generator" width="100%"
              height="100%" frameBorder="0" allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"></iframe>
    </Wrapper>
  )
}