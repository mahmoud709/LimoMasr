export function SectionHeader({
  eyebrow,
  title,
  text,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-12 max-w-3xl">
      {eyebrow ? (
        <p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#B88A44] uppercase opacity-90 flex items-center gap-3">
          <span className="h-[1px] w-8 bg-[#B88A44]"></span>
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-3xl md:text-4xl lg:text-5xl font-black text-[#111] tracking-tight leading-[1.2]">
        {title}
      </Heading>
      {text ? <p className="mt-6 text-lg leading-relaxed text-black/60 font-light max-w-2xl">{text}</p> : null}
    </div>
  );
}
