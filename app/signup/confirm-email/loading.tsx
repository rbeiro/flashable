import * as Skeleton from '../../../src/components/Skeleton'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <>
      <Skeleton.Root maxWidth={610}>
        <Skeleton.MediumContainer>
          <Skeleton.FullLine lineThickness={25} />
        </Skeleton.MediumContainer>

        <Skeleton.Container>
          <Skeleton.FullLine lineThickness={16} />
          <Skeleton.ShortLine lineThickness={16} />
          <Skeleton.FullLine lineThickness={50} />
        </Skeleton.Container>
      </Skeleton.Root>
    </>
  )
}
