import React from "react"

export const CAR_COLORS = [
  "#ef5d6c",
  "#4f8edc",
  "#f2b84b",
  "#7b61c9",
  "#38a887",
  "#e779b1",
  "#e67e22",
  "#20bf6b",
]

export function Car({
  index,
  small = false,
  color,
}: {
  index: number
  small?: boolean
  color?: string
}) {
  const carColor = color || CAR_COLORS[index % CAR_COLORS.length]

  return (
    <div
      className={`car ${small ? "car-small" : ""}`}
      style={{ "--car": carColor } as React.CSSProperties}
    >
      <span className="window" />
      <span className="window" />
      <span className="wheel left" />
      <span className="wheel right" />
    </div>
  )
}
