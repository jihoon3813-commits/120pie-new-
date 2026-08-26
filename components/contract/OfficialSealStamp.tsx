import React from "react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

interface OfficialSealStampProps {
  size?: number;
  className?: string;
}

const SEAL_IMAGE_URL = "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1787726674/edited-photo_98_fsgw57.png";

export const OfficialSealStamp: React.FC<OfficialSealStampProps> = ({ size = 88, className = "" }) => {
  const optimizedUrl = optimizeCloudinaryUrl(SEAL_IMAGE_URL);

  return (
    <div 
      className={`inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      title="(주)고우웰라이프 대표이사 직인"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={optimizedUrl}
        alt="(주)고우웰라이프 대표이사 직인"
        width={size}
        height={size}
        className="w-full h-full object-contain filter contrast-125 saturate-200 drop-shadow-xs transform -rotate-3"
        style={{
          filter: "contrast(1.3) saturate(2.2) brightness(0.95)",
        }}
      />
    </div>
  );
};
