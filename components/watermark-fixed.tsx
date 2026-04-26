export function WatermarkFixedBR() {
  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='640' height='200' viewBox='0 0 640 200'>
  <text x='0' y='150' fontFamily='Inter, Arial, sans-serif' fontWeight='700' fontSize='140' fill='rgba(30,64,175,0.06)'>Rasal</text>
</svg>`
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  return (
    <img
      src={src || "/placeholder.svg"}
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed bottom-4 right-4 z-10 select-none w-[40vw] max-w-[420px] min-w-[180px] -rotate-[15deg]"
    />
  )
}
