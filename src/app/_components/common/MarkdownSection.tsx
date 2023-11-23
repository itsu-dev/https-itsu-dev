import Section from '@/app/_components/common/Section';
import { marked } from 'marked';
import { styled } from '@linaria/react';

const Wrapper = styled.div`
  width: 100%;
`;

type Props = {
  fileUrl: string;
}

export default async function MarkdownSection({ fileUrl }: Props) {
  const fileFetcher = async () => {
    return await (await fetch(process.env.HOST + fileUrl)).text();
  }

  const text = await fileFetcher();

  return (
    <Section>
      <Wrapper dangerouslySetInnerHTML={{__html: marked(text)}}></Wrapper>
    </Section>
  )
}