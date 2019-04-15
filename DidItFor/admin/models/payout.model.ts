import { ICreatorApi, IRecieverApi, IChallenge } from 'app/admin/models';

export interface IPayout {
  id: number;
  challenge_id: number;
  payout_type: string;
  receiver_type: string;
  status: string;
  creator_id: number;
  receiver_id: number;
  quickbooks_bank_account_id: number;
  quickbooks_address_id: number;
  quickbooks_payout_id: number;
  last_sync_at: string;
  status_updated_at: string;
  amount_in_cents: number;
  payout_account_name: string;
  created_at: string;
  updated_at: string;
  creator: ICreatorApi;
  receiver: IRecieverApi;
  challenge: IChallenge;
}
