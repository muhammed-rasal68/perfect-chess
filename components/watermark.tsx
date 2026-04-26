export function Watermark() {
  // Single, faint "Rasal" watermark anchored bottom-right
  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='600' height='200' viewBox='0 0 600 200'>
  <text x='0' y='150' fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="140" fill="rgba(30,64,175,0.06)">Rasal</text>
</svg>`
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  return (
    <img
      src={src || "/placeholder.svg"}
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 right-6 z-30 select-none opacity-90"
      style={{
        width: "38vw",
        maxWidth: 360,
        minWidth: 180,
        transform: "rotate(-15deg)",
        filter: "blur(0.0px)",
      }}
    />
  )
}
