import type { payments } from "db/schema";

export type NowPaymentCurrency = {
  id: number;
  code: string;
  name: string;
  enable: boolean;
  wallet_regex: string;
  priority: number;
  extra_id_exists: boolean;
  extra_id_regex: any;
  logo_url: string;
  track: boolean;
  cg_id: string;
  is_maxlimit: boolean;
  network: string;
  smart_contract: any;
  network_precision: any;
};

export type NowPaymentCreatePaymentResponse = {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  network: string;
  expiration_estimate_date: string;
  valid_until: string;
};


export type PaymentStatus =
  | "waiting"
  | "processing"
  | "partially_paid"
  | "finished"
  | "failed"
  | "expired";

type Payment = typeof payments.$inferInsert
export type GetPaymentResponse = {
  invoiceId: string,
  paymentStatus: PaymentStatus,
  plan: Payment['planInfo'],
  isTrial: boolean,
  payCurrency:string,
  payAmount:number,
  payAddress: string,
  network: string,
  paymentExpiry: string,
  subscription: {
    uuid: string,
  },
  lastUpdate: {
    actually_paid?: number,
  },
}
