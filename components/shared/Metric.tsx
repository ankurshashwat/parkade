import Link from "next/link";
import Image from "next/image";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: string | number | Date;
  title?: string;
  href?: string;
  textStyles?: string;
  isOwner?: boolean;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  isOwner,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={16}
        height={16}
        className={`object-contain ${href && "rounded-full"}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {typeof value === "string" || typeof value === "number"
          ? value.toString()
          : value?.toLocaleDateString()}
        {title && (
          <span
            className={`small-regular line-clamp-1 ${
              isOwner && "max-sm:hidden"
            }`}
          >
            {title}
          </span>
        )}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {metricContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
