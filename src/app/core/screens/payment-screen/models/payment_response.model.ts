export class PaymentResponse {
  id!: string;
  description!: string;
  transaction_amount!: number;
  date_of_expiration!: Date;
  point_of_interaction!: PointOfInteraction;
}

export class PointOfInteraction {
    transaction_data!: TransactionData;
}

export class TransactionData {
    qr_code!: string;
    qr_code_base64!: string;
    ticket_url!: string;
}
