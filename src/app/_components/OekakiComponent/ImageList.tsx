import { styled } from '@linaria/react';
import { SiAddthis } from '@icons-pack/react-simple-icons';
import Heading from '@/app/_components/common/Heading';
import OekakiImageCard from '@/app/_components/OekakiComponent/OekakiImageCard';
import Image from 'next/image';
import { IMAGE_MAX_DRAW_COUNT } from '@/app/_consts/oekaki';

const Wrapper = styled.article`
  width: 100%;
  animation: openAnimation .5s ease forwards;

  @keyframes openAnimation {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ListWrapper = styled.section`
  width: 100%;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15%, 1fr));
  grid-gap: 16px;
  justify-self: center;
  align-self: center;

  @media (max-width: 599px) {
    grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
  }

  @media (min-width: 599px) and (max-width: 1100px) {
    grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
  }
`;

const imagesFetcher = async (): Promise<Result<OekakiImage[]>> => {
  try {
    const response = await fetch('https://itsu-dev-oekaki.itsu020402.workers.dev/api/oekaki/images', { cache: 'no-cache' });
    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    if (!data.success) {
      return { success: false };
    }

    return { success: true, result: data.images };

  } catch (e) {
    return { success: false };
  }
};

export default async function ImageList() {
  const images = await imagesFetcher();

  return (
    <Wrapper>
      <Heading as={'h2'}>描きたい絵を選ぶ</Heading>
      <ListWrapper>
        <OekakiImageCard imageId={''}>
          <SiAddthis color={'var(--color-primary)'} size={32} />
        </OekakiImageCard>
        {images.success && images.result.map((image, index) =>
          <OekakiImageCard key={index} imageId={image.id} isCompleted={image.count >= IMAGE_MAX_DRAW_COUNT}>
            <Image src={`https://i.imgur.com/${image.imgurId}.jpg`} alt={image.id} layout={'cover'} fill/>
          </OekakiImageCard>
        )}
        {!images.success && <p>エラーが発生しました</p>}
      </ListWrapper>
    </Wrapper>
  );
}