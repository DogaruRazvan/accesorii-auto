import { clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-[0_6px_24px_-6px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out group-hover:border-gray-200 group-hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.25)] group-hover:-translate-y-1.5",
        className,
        {
          "aspect-[4/5]": isFeatured,
          "aspect-[4/5]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      draggable={false}
      quality={60}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 text-gray-300">
      <PlaceholderImage size={size === "small" ? 20 : 32} />
    </div>
  )
}

export default Thumbnail
