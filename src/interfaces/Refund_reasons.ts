export default interface Reasons {
    refund_reasons: RefundReason[];
}

export interface RefundReason {
    id:     number;
    reason: string;
}
