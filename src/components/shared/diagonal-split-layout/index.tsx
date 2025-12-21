import React from "react";
import "./index.css";

export interface DiagonalSplitLayoutProps {
  /** List of image URLs, one per slice. Required. */
  imageUrls: string[];
  /** Optional per-image alt text */
  imageAlts?: (string | undefined)[];
  /** Optional per-image loading hints */
  imageLoadings?: ("lazy" | "eager")[];
  /** Optional explicit top-edge split positions (length must be imageUrls.length - 1) */
  splitPositions?: number[];
  /** If true, diagonal direction is reversed (top-right -> bottom-left) */
  reverse?: boolean;
  /** Percent shift applied to bottom edge to create the slanted effect (0 = straight vertical bands) */
  skew?: number;
  /** CSS height value for the component (e.g., '400px', '50vh') */
  height?: string;
  /** Optional overlay color for all slices (rgba) */
  overlayColor?: string;
  className?: string;
}

export const DiagonalSplitLayout: React.FC<DiagonalSplitLayoutProps> = ({
  imageUrls,
  imageAlts,
  imageLoadings,
  splitPositions,
  reverse = false,
  /** Percent shift applied to bottom edge to create the slanted effect (0 = straight vertical bands) */
  skew = -12,
  height = "480px",
  overlayColor = "rgba(0,0,0,0.25)",
  className = "",
}) => {
  // use provided imageUrls (may be empty)
  const imgs: string[] = (imageUrls || []).slice();

  const alts: (string | undefined)[] =
    imageAlts && imageAlts.length === imgs.length
      ? imageAlts
      : Array(imgs.length).fill(undefined);

  const loadings: ("lazy" | "eager")[] =
    imageLoadings && imageLoadings.length === imgs.length
      ? (imageLoadings as ("lazy" | "eager")[])
      : Array(imgs.length).fill("lazy");

  const n = Math.max(1, imgs.length);

  // build top edge positions (0 ... 100). If splitPositions provided and valid, use it.
  let topPositions: number[] = [];
  if (splitPositions && splitPositions.length === n - 1) {
    topPositions = [0, ...splitPositions, 100];
  } else {
    topPositions = Array.from({ length: n + 1 }, (_, i) =>
      Math.round((i * 100) / n)
    );
  }

  // helper to compute polygon for slice i (robust to degenerate values)
  const sliceClip = (i: number) => {
    const topStartRaw = topPositions[i];
    const topEndRaw = topPositions[i + 1];

    // If there's only one slice, return full rectangle
    if (n === 1) return "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

    // Ensure topStart < topEnd with a small epsilon to avoid zero-width polygons
    const EPS = 0.5; // percent
    let topStart = Math.max(0, Math.min(100, topStartRaw));
    let topEnd = Math.max(0, Math.min(100, topEndRaw));
    if (topEnd - topStart < EPS) {
      topEnd = Math.min(100, topStart + EPS);
    }

    // compute bottom edge offset for slanted parallel slices
    let bottomStart = Math.min(
      100,
      Math.max(0, topStart + (reverse ? -skew : skew))
    );
    let bottomEnd = Math.min(
      100,
      Math.max(0, topEnd + (reverse ? -skew : skew))
    );

    // Ensure bottomEnd > bottomStart
    if (bottomEnd - bottomStart < EPS) {
      bottomEnd = Math.min(100, bottomStart + EPS);
      // if that would overflow, pull bottomStart back
      if (bottomEnd > 100) {
        bottomEnd = 100;
        bottomStart = Math.max(0, bottomEnd - EPS);
      }
    }

    // Final clamp just in case
    topStart = Math.max(0, Math.min(100, topStart));
    topEnd = Math.max(0, Math.min(100, topEnd));
    bottomStart = Math.max(0, Math.min(100, bottomStart));
    bottomEnd = Math.max(0, Math.min(100, bottomEnd));

    // If this is the last slice, always fill the rest of the right side to avoid gaps
    if (i === n - 1) {
      // ensure topEnd and bottomEnd are 100
      topEnd = 100;
      bottomEnd = 100;
      // if bottomStart would equal bottomEnd, nudge it left by EPS
      if (bottomEnd - bottomStart < EPS) {
        bottomStart = Math.max(0, bottomEnd - EPS);
      }
      return `polygon(${topStart}% 0, 100% 0, 100% 100%, ${bottomStart}% 100%)`;
    }

    // polygon(topStart 0, topEnd 0, bottomEnd 100%, bottomStart 100%)
    return `polygon(${topStart}% 0, ${topEnd}% 0, ${bottomEnd}% 100%, ${bottomStart}% 100%)`;
  };

  return (
    <div className={`diagonal-split ${className}`} style={{ height }}>
      {imgs.map((url, i) => {
        if (!url) {
          // render empty slice with overlay only
          return (
            <div
              key={i}
              className={`dsl-slice dsl-slice-${i}`}
              style={{ clipPath: sliceClip(i), zIndex: i }}
              aria-hidden
            >
              <div
                className="dsl-overlay"
                style={{ backgroundColor: overlayColor }}
              />
            </div>
          );
        }

        return (
          <div
            key={i}
            className={`dsl-slice dsl-slice-${i}`}
            style={{ clipPath: sliceClip(i), zIndex: i }}
            aria-hidden={!url}
          >
            <img
              className="dsl-img"
              src={url}
              alt={alts[i] ?? ""}
              loading={loadings[i] ?? "lazy"}
            />
            <div
              className="dsl-overlay"
              style={{ backgroundColor: overlayColor }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DiagonalSplitLayout;
