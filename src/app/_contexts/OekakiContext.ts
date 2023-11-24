'use client';

import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

export type OekakiState = 'select' | 'draw' | 'submit';

type OekakiContext = {
  state: OekakiState;
  setState: Dispatch<SetStateAction<OekakiState>>;
  selectedImageId: string | null;
  setSelectedImageId: Dispatch<SetStateAction<string | null>>;
  imageBuffer: Uint8Array | null;
  setImageBuffer: Dispatch<SetStateAction<Uint8Array | null>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
}

const defaultContext: OekakiContext = {
  state: 'select',
  setState: () => undefined,
  selectedImageId: null,
  setSelectedImageId: () => undefined,
  imageBuffer: null,
  setImageBuffer: () => undefined,
  description: '',
  setDescription: () => undefined,
};

export const OekakiContext = React.createContext<OekakiContext>(defaultContext);

const useMemoizedState = <T>(defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, _setValue] = useState<T>(defaultValue);
  return [value, useCallback((v: T | ((prev: T) => T)) => _setValue(v), [])];
};

export default function useOekakiContext() {
  const [state, setState] = useMemoizedState<OekakiState>(defaultContext.state);
  const [selectedImageId, setSelectedImageId] = useMemoizedState<string | null>(defaultContext.selectedImageId);
  const [imageBuffer, setImageBuffer] = useMemoizedState<Uint8Array | null>(defaultContext.imageBuffer);
  const [description, setDescription] = useMemoizedState<string>(defaultContext.description);

  return {
    state,
    setState,
    selectedImageId,
    setSelectedImageId,
    imageBuffer,
    setImageBuffer,
    description,
    setDescription,
  };
}