'use client'

import { ConvexProvider, ConvexReactClient } from "convex/react";

type Props = {
  children: React.ReactNode;
};

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

const convex = new ConvexReactClient(CONVEX_URL);

const ConvexClientProviders = ({ children }: Props) => {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
};

export default ConvexClientProviders;
