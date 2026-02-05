
export enum AppView {
  TERMINAL = 'TERMINAL',
  SETUP = 'SETUP',
  EQUITY_REPORT = 'EQUITY_REPORT',
  EARNING_REPORT = 'EARNING_REPORT'
}

export type CardBrand = 'visa' | 'master' | 'jcb' | 'diners' | 'amex' | 'generic';

export interface AccountInfo {
  masked: string;
  brand: CardBrand;
}

export interface LedgerEntry {
  id: string;
  type: string;
  subType?: string; // Masked account (e.g., ***1234)
  subTypeBrand?: CardBrand;
  date: string;
  category: {
    l1: string;
    l2: string;
    l3: string;
  };
  details: string;
  in: number | null;
  out: number | null;
  remarks: string;
}

export interface BalanceState {
  cash: number;
  bank: number;
  stock: number;
  loan: number;
  card: number;
  capital: number;
}
