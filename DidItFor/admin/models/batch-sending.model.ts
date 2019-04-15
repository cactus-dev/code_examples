export interface IBatchData {
  challenge_id: number;
  payouts: IBatchPayouts;
}

export interface IBatchPayouts {
  user?: IBatchAmount;
  charity?: IBatchAmount;
}

export interface IBatchAmount {
  amount_in_cents: number;
}
