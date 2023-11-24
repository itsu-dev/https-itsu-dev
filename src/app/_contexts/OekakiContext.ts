"use client";

import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';

export type OekakiState = 'select' | 'draw' | 'submit';

type OekakiContext = {
  state: OekakiState;
  setState: Dispatch<SetStateAction<OekakiState>>;
  selectedImageId: string | null;
  setSelectedImageId: Dispatch<SetStateAction<string | null>>;
}

const defaultContext: OekakiContext = {
  state: 'select',
  setState: () => undefined,
  selectedImageId: null,
  setSelectedImageId: () => undefined,
};

export const OekakiContext = React.createContext<OekakiContext>(defaultContext);

const useMemoizedState = <T>(defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, _setValue] = useState<T>(defaultValue);
  return [value, useCallback((v: T | ((prev: T) => T)) => _setValue(v), [])];
};

export default function useOekakiContext() {
  const [state, setState] = useMemoizedState<OekakiState>(defaultContext.state);
  const [selectedImageId, setSelectedImageId] = useMemoizedState<string | null>(defaultContext.selectedImageId);
  return { state, setState, selectedImageId, setSelectedImageId };
}