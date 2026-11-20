import React from "react";

export const CAR_COLORS = [
  "#ef5d6c",
  "#4f8edc",
  "#f2b84b",
  "#7b61c9",
  "#38a887",
  "#e779b1",
  "#e67e22",
  "#20bf6b",
];

export function Car({
  index,
  small = false,
  color,
  label,
}: {
  index: number;
  small?: boolean;
  color?: string;
  label?: string;
}) {
  const carColor = color || CAR_COLORS[index % CAR_COLORS.length];

  return (
    <div
      className={`car ${small ? "car-small" : ""}`}
      style={{ "--car": carColor } as React.CSSProperties}
    >
      <svg
        className="car-image"
        viewBox="0 0 180 92"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={label ? `Mobil proses ${label}` : "Mobil proses"}
      >
        <path
          className="car-shadow"
          d="M20 78h143c7 0 12 3 12 6s-5 5-12 5H20c-8 0-13-2-13-5s5-6 13-6Z"
        />
        <path
          className="car-body"
          d="M10 55c2-9 10-16 22-18l19-3 17-22c4-5 9-8 16-8h34c7 0 12 3 17 8l20 23 13 4c7 2 11 8 11 15v18H10V55Z"
        />
        <path className="car-glass" d="m62 33 14-18c2-3 5-4 9-4h9v22H62Z" />
        <path className="car-glass" d="M102 11h15c4 0 7 2 10 5l15 17h-40V11Z" />
        <path className="car-detail" d="M96 12v21M54 40h91M12 59h16M161 47h14" />
        <path className="car-light front" d="M163 43h9c4 1 6 4 6 8h-15V43Z" />
        <path className="car-light rear" d="M11 45h10v10H9c0-4 0-7 2-10Z" />
        <circle className="car-wheel" cx="48" cy="72" r="16" />
        <circle className="car-hub" cx="48" cy="72" r="7" />
        <circle className="car-wheel" cx="142" cy="72" r="16" />
        <circle className="car-hub" cx="142" cy="72" r="7" />
      </svg>
      {label && <span className="car-id-label">{label}</span>}
    </div>
  );
}
