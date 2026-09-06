"use client";

import { Lottie } from "lottie-react";
import loader from "@/public/lottie/loader.json";
import success from "@/public/lottie/success.json";
import empty from "@/public/lottie/empty.json";

const MAP = {
  loader,
  success,
  empty,
};

export function LottieMark({
  kind = "loader",
  size = 120,
  loop,
  className,
}: {
  kind?: keyof typeof MAP;
  size?: number;
  loop?: boolean;
  className?: string;
}) {
  return (
    <Lottie
      className={className}
      src={MAP[kind]}
      autoplay
      loop={loop ?? kind !== "success"}
      style={{ width: size, height: size }}
    />
  );
}
