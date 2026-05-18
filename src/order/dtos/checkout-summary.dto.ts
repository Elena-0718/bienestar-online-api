export class CheckoutSummaryDto {
  subtotal: number;
  iva: number;
  deliveryCost: number;
  total: number;
  reference: string;
  bankName: string;
  accountNumber: string;
  shippingAddress: string; // Añadido
  shippingPhone: string;   // Añadido
  items: {
    productName: string;
    quantity: number;
    subtotal: number;
  }[];
}