/** Centred kicker + title + lede used by every landing section (prototype `.sec-tengah`). */
export function SectionHeading({
  kicker,
  title,
  lede,
  id
}: {
  kicker: string
  title: string
  lede: string
  id: string
}) {
  return (
    <div className='mx-auto max-w-[720px] text-center'>
      <p className='text-xs font-semibold tracking-[0.12em] text-brand-accent uppercase'>{kicker}</p>
      <h2 id={id} className='mt-3 text-[28px] leading-[1.18] font-semibold tracking-[-0.02em] sm:text-[34px]'>
        {title}
      </h2>
      <p className='mt-3 text-base text-muted-foreground'>{lede}</p>
    </div>
  )
}
