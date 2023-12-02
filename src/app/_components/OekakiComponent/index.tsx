import ImageList from '@/app/_components/OekakiComponent/ImageList';
import { styled } from '@linaria/react';
import ImageDrawer from '@/app/_components/OekakiComponent/ImageDrawer';
import ImageViewer from '@/app/_components/OekakiComponent/ImageViewer';

const Wrapper = styled.div`
  width: 100%;
`;

export default function OekakiComponent({imageId, gallery}: {imageId?: string, gallery?: string}) {
  return (
    <Wrapper>
      {
        (() => {
          switch (true) {
            case gallery != null:
              return <ImageViewer imageId={gallery} />
            case imageId == null:
              return <ImageList />;
            case imageId != null:
              return <ImageDrawer imageId={imageId} />
            default:
              return null;
          }
        })()
      }
    </Wrapper>
  );
}