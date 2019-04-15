export interface ICreatorApi {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
  approved: boolean;
  name: string;
  account_name: string;
  account_number: number;
  routing_number: number;
  guest: boolean;
  stripe_id: string;
  total_donated_amount: number;
  last_donated_amount: number;
  guest_migrated: boolean;
  status: string;
  role: string;
  phone_number: number;
}
