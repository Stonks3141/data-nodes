import { createContext } from 'preact';
import type { PocketBase } from 'pocketbase';

export const Pb = createContext<PocketBase>();
