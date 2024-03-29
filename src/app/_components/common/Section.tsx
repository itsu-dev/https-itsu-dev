import { styled } from '@linaria/react';

const Wrapper = styled.section`
  width: 100%;
  color: var(--foreground-color);
  
  h1 {
    font-size: 1.8rem;
    margin: 0 0 8px 0;
  }

  h2 {
    font-size: 1.5rem;
    margin: 0 0 7px 0;
  }

  h3 {
    font-size: 1.3rem;
    margin: 0 0 6px 0;
  }

  h4 {
    font-size: 1.1rem;
    margin: 0 0 5px 0;
  }

  h5 {
    font-size: 1.0rem;
    margin: 0 0 4.5px 0;
  }

  h6 {
    font-size: 0.9rem;
    margin: 0 0 3px 0;
  }
`;

type Props = {
  children: React.ReactNode | React.ReactNode[];
}

export default function Section({ children }: Props) {
  return <Wrapper>{children}</Wrapper>
}