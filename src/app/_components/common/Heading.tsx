import { styled } from '@linaria/react';

const Headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
type Props = {
  children: React.ReactNode;
  as?: typeof Headings[number];
  baseFontSize?: number;
  small?: boolean;
}

function Tag({ children, as = 'h1' }: Props & React.ComponentProps<any>) {
  const Tag = `${as}` as keyof JSX.IntrinsicElements;
  return <Tag>{children}</Tag>;
}

const StyledTag = styled(Tag as unknown as keyof JSX.IntrinsicElements)`
  color: var(--foreground-color);
  margin: 0;
`;

export default function Heading({ children, as = 'h1', baseFontSize = 1.5, small = false }: Props) {
  return <StyledTag as={as as keyof JSX.IntrinsicElements}
                    style={{
                      fontSize: `${baseFontSize * 0.92 ** Headings.indexOf(as)}rem`,
                      fontWeight: small ? 'normal' : 'bold',
                      color: small ? 'var(--foreground-sub-color)' : 'var(--foreground-color)'
                    }}>{children}</StyledTag>;
}