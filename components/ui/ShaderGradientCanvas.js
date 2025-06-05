"use client";

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

export const ShaderGradientBackground = ({ children }) => {
  return (
    <>
    <ShaderGradientCanvas>
      <ShaderGradient />
    </ShaderGradientCanvas>
    {children}
    </>
  );
};