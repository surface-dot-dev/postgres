import { Tool } from '../client';
import { SelectToolInput, SelectToolOutput } from '@shared/types';

export const select = Tool<SelectToolInput, SelectToolOutput>('select');
