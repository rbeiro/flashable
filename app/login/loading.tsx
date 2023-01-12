import * as Skeleton from '../../src/components/Skeleton'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <>
      <Skeleton.Root minWidth={391.17}>
        <Skeleton.ExtraSmallContainer>
          <Skeleton.FullLine />
        </Skeleton.ExtraSmallContainer>

        <Skeleton.Container>
          <Skeleton.MediumLine lineThickness={25} />
          <Skeleton.FullLine lineThickness={50} />
          <Skeleton.FullLine lineThickness={50} />
          <Skeleton.FullLine lineThickness={50} />
        </Skeleton.Container>
      </Skeleton.Root>
    </>
  )
}
