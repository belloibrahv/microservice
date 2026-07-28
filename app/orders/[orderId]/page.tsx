import { OrderDetailPage } from "@/components/order-detail-page";

export default async function OrderDetailRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <OrderDetailPage orderId={orderId} />;
}
