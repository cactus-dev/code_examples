import { IChallenge, ICreatorApi } from 'app/admin/models';

export interface IRefund {
  challenge: IChallenge;
  challenge_id: number;
  created_at: string;
  donor: ICreatorApi;
  donor_id: number;
  id: number;
  payment_transaction_id: number;
  refund_amount_in_cents: number;
  status: string;
  stripe_refund_id: number;
  updated_at: string;
  user: ICreatorApi;
  user_id: number;
}
