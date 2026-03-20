import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0c0c0c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Watch case */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "4px solid #c4903a",
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
              right: -16,
              top: "50%",
              marginTop: -10,
              width: 10,
              height: 20,
              background: "#c4903a",
              borderRadius: 3,
            }}
          />
          {/* 12 o'clock marker */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              marginLeft: -2,
              width: 4,
              height: 12,
              background: "#c4903a",
              borderRadius: 2,
            }}
          />
          {/* 6 o'clock marker */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              marginLeft: -2,
              width: 4,
              height: 12,
              background: "#c4903a",
              borderRadius: 2,
            }}
          />
          {/* Hour hand — 10 o'clock */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "50%",
              marginLeft: -3,
              width: 6,
              height: 38,
              background: "#d4d4d4",
              borderRadius: 3,
              transformOrigin: "50% 100%",
              transform: "rotate(-60deg)",
            }}
          />
          {/* Minute hand — 2 o'clock */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "50%",
              marginLeft: -2,
              width: 4,
              height: 50,
              background: "#d4d4d4",
              borderRadius: 3,
              transformOrigin: "50% 100%",
              transform: "rotate(60deg)",
            }}
          />
          {/* Center cap */}
          <div
            style={{
              position: "absolute",
              width: 14,
              height: 14,
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
