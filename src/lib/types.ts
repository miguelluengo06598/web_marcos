export type Role = 'admin' | 'client'
export type RiskProfile = 'conservador' | 'moderado' | 'agresivo'
export type RiskLevel = 'bajo' | 'moderado' | 'alto' | 'muy_alto'
export type AssetType = 'renta_variable' | 'renta_fija' | 'liquidez' | 'alternativo'
export type PostCategory = 'mercados' | 'opinion' | 'informe' | 'aviso' | 'educacion'

export interface Profile {
  id: string
  role: Role
  full_name: string
  email: string
  phone?: string
  avatar_url?: string
  created_at: string
}

export interface Portfolio {
  id: string
  client_id: string
  total_value: number
  ytd_return: number
  risk_profile: RiskProfile
  last_updated: string
  notes?: string
}

export interface PortfolioPosition {
  id: string
  portfolio_id: string
  asset_name: string
  asset_type: AssetType
  value: number
  weight_pct: number
  return_pct: number
  isin?: string
}

export interface Product {
  id: string
  client_id: string
  name: string
  isin?: string
  manager?: string
  estimated_return?: string
  min_horizon_years?: number
  min_investment?: number
  management_fee?: number
  risk_level: RiskLevel
  advisor_note?: string
  is_priority: boolean
  is_visible: boolean
  visible_from?: string
  interest_expressed: boolean
  interest_at?: string
  created_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  category: PostCategory
  cover_url?: string
  pdf_url?: string
  published: boolean
  published_at?: string
  created_at: string
}

export interface Document {
  id: string
  client_id: string
  product_id?: string
  name: string
  file_url: string
  file_type: string
  created_at: string
}

export interface PortfolioSnapshot {
  id: string
  client_id: string
  capital_total: number
  recorded_at: string
}

export interface InvestmentProduct {
  id: string
  name: string
  description?: string
  created_by?: string
  created_at: string
}

export interface ClientProduct {
  id: string
  client_id: string
  product_id: string
  initial_investment: number
  current_capital: number
  created_at: string
  investment_products?: InvestmentProduct
}

export interface ClientProductSnapshot {
  id: string
  client_product_id: string
  capital_total: number
  recorded_at: string
}

export type OperationType = 'buy' | 'sell'
export type OperationResult = 'win' | 'loss'

export interface Operation {
  id: string
  client_product_id: string
  type: OperationType
  points: number
  action_price: number
  result: OperationResult
  notes?: string
  operated_at: string
  // Optional join — present when fetched with client_products(investment_products(*))
  client_products?: {
    investment_products?: {
      name: string
    }
  }
}