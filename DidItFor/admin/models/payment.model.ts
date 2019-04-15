import { IChallenge, ICreatorApi } from 'app/admin/models';

export interface IPayment {
  id: number;
  created_at: string;
  amount_in_cents: number;
  user: ICreatorApi;
  challenge: IChallenge;
  status: string;
  checked: boolean;
}
