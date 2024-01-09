import { createContext, useContext } from 'react';
import { Metaplex } from '@metaplex-foundation/js';

interface MetaplexContextType {
  metaplex: Metaplex | null; // Specify that metaplex can be of type Metaplex or null
}
const DEFAULT_CONTEXT: MetaplexContextType = {
  metaplex: null,
};

export const MetaplexContext = createContext(DEFAULT_CONTEXT);

export function useMetaplex() {
  return useContext(MetaplexContext);
}
