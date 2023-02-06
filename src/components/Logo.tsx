import Image from "next/image";

type LogoProps = {
  width?: number;
  height?: number;
  alt?: string;
};

export const Logo = ({
  width = 64,
  height = 64,
  alt = "Lineside Industrial Automation Logo",
}: LogoProps) => {
  return (
    <Image
      src="/logo_noname.png"
      width={width} // This is the same as '320', just a little more explicit, using actual number instead of a string
      height={height} // same as above
      alt={alt}
      sizes="(max-width: 576px) 24px,
          (max-width: 768px) 32px,
          (max-width: 1024px) 48px"
      //   className={`d-flex align-tems-center m-auto flex h-[${height}px] w-[${width}px}]`}
    />
  );
};
