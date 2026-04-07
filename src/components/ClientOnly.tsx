'use client';

import { useState, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const hasMounted = useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
