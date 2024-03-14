import { createContext } from 'preact';
import PocketBase from 'pocketbase';

export const Pb = createContext<PocketBase | null>(null);
