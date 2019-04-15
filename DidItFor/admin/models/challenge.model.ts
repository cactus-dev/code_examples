import {
  ICreatorApi,
  IAmountInCentsApi,
  ICharitable,
  ICanDoPayout
} from 'app/admin/models';

export interface IChallenge {
  id: number;
  user_id: number;
  can_do_payouts: ICanDoPayout;
  has_vendor_billcom_id: ICanDoPayout;
  charitable_organization_id: number;
  charitable_organization: ICharitable;
  title: string;
  description: string;
  hash_tag: string;
  charity_goal: number;
  charity_share: number;
  created_at: string;
  updated_at: string;
  inappropriate: boolean;
  published: boolean;
  account_id: number;
  challenge_response_id: number;
  views_count: number;
  total_donation_amount_in_cents: number;
  deleted: boolean;
  branch_io_url: string;
  inappropriate_count: number;
  status: string;
  charity_share_amount: number;
  donation_disabled: boolean;
  video_view_count: number;
  total_challenge_response_count: number;
  available_donations_payouts_in_cents: number;
  creator: ICreatorApi;
  payout_pending_amount_in_cents: IAmountInCentsApi;
  available_for_payout_amount_in_cents: IAmountInCentsApi;
  total_paid_out_amount_in_cents: IAmountInCentsApi;
  last_payout_at: string;
  info: string;
  is_active: boolean;
  checked?: boolean;
}
