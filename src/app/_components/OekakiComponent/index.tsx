import ImageList from '@/app/_components/OekakiComponent/ImageList';
import { styled } from '@linaria/react';
import ImageDrawer from '@/app/_components/OekakiComponent/ImageDrawer';
import ImageViewer from '@/app/_components/OekakiComponent/ImageViewer';

const Wrapper = styled.div`
  width: 100%;
`;

export default function OekakiComponent({searchParams}: {searchParams: {image_id?: string, gallery?: string}}) {
  return (
    <Wrapper>
      {
        (() => {
          switch (true) {
            case searchParams.gallery != null:
              return <ImageViewer imageId={searchParams.gallery} />
            case searchParams.image_id == null:
              return <ImageList />;
            case searchParams.image_id != null:
              return <ImageDrawer imageId={searchParams.image_id} />
            default:
              return null;
          }
        })()
      }
    </Wrapper>
  );
}