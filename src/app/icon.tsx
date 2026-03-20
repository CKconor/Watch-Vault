import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0c0c0c",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Watch case */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: "2px solid #c4903a",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Crown */}
          <div
            style={{
              position: "absolute",
              right: -5,
              top: "50%",
              marginTop: -3,
              width: 3,
              height: 6,
              background: "#c4903a",
              borderRadius: 1,
            }}
          />
          {/* Hour hand — 10 o'clock (-60° from 12) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "50%",
              marginLeft: -0.75,
              width: 1.5,
              height: 6,
              background: "#d4d4d4",
              borderRadius: 1,
              transformOrigin: "50% 100%",
              transform: "rotate(-60deg)",
            }}
          />
          {/* Minute hand — 2 o'clock (60° from 12) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "50%",
              marginLeft: -0.5,
              width: 1,
              height: 8,
              background: "#d4d4d4",
              borderRadius: 1,
              transformOrigin: "50% 100%",
              transform: "rotate(60deg)",
            }}
          />
          {/* Center cap */}
          <div
            style={{
              position: "absolute",
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "#c4903a",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
