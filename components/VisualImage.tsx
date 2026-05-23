"use client";

import { useEffect, useState } from "react";

export default function VisualImage({
  src,
  label,
  className = "",
  badge
}: {
  src: string;
  label: string;
  className?: string;
  badge?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setFailed(false);
    image.onerror = () => setFailed(true);
    image.src = src;
  }, [src]);

  return (
    <div className={`media-frame ${className}`}>
      {!failed ? (
        <img src={src} alt={label} onError={() => setFailed(true)} />
      ) : (
        <div className="media-fallback">
          <span>{label}</span>
          <small>{src}</small>
        </div>
      )}
      {badge ? <b>{badge}</b> : null}
    </div>
  );
}
