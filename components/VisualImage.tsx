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
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setReady(false);
    setFailed(false);
    const image = new Image();
    image.onload = () => setReady(true);
    image.onerror = () => setFailed(true);
    image.src = src;
  }, [src]);

  return (
    <div className={`media-frame ${className}`}>
      {ready && !failed ? (
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
