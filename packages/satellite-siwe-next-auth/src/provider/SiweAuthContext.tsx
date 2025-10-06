'use client';

import { createContext } from 'react';

import { SiweAuthContextType } from '../types';

export const SiweAuthContext = createContext<SiweAuthContextType | undefined>(undefined);
