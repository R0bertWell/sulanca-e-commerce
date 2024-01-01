import { Address } from "mercadopago/shared/address";

export class Payment {
  payer!: Payer;
  payment_method_id!: string;
  transaction_amount!: number;
  description!: string;
}

export class Payer {
  first_name!: string;
  last_name!: string;
  email!: string;
  identification!: Identification;
  address?: Address
}

export interface Identification {
    type: string;
    number: string;
}

