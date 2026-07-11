export interface PaymentQrData {
  version: string
  merchant_id: string
  merchant_name: string
  account_id: string
  amount: number
  currency: string
  order_id: string
  transaction_id: string
  timestamp: string
}

export interface Payment {
  id: number
  order_id: number | null
  amount: number
  currency: string
  description?: string | null
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled'
  deeplink: string | null
  qr_string: string | null
  transaction_hash: string | null
  paid_at: string | null
  created_at: string
  updated_at?: string
}

export interface PaymentGenerateResponse {
  payment: Payment
}

export interface PaymentConfirmResponse {
  payment: {
    id: number
    status: string
    paid_at: string | null
  }
  order_status: string
}

export interface PaymentStatusResponse {
  payment: Payment | null
  order_status: string
}
