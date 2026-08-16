import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { redirect } from "next/navigation";
import Header from "../_components/header";
import OrderItem from "./_components/order-item";
import { Button } from "../_components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { serializePrismaObject } from "../_helpers/price";

const MyOrdersPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }



  const orders = await db.order.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      restaurant: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  const serializedOrders = serializePrismaObject(orders);

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <div className="mb-6 inline-flex items-center  justify-center">
          <div className="hidden md:block">
            <Button
              className=" rounded-full 
            border border-solid border-muted-foreground dark:bg-[#260D0E] dark:border-[#fefafa] bg-[#F4F4F4]  text-foreground shadow-sm"
              size="icon"
              asChild
            >
              <Link href="/">
                <ChevronLeftIcon className="dark:text-white" />
              </Link>
            </Button>
          </div>

          <h2 className="pl-0 text-lg font-semibold md:pl-4 ">Meus Pedidos</h2>
        </div>

        {serializedOrders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {serializedOrders.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="mt-64 flex flex-col items-center justify-center">
            <h3 className="text-center font-medium">
              Você não efetuou nenhum pedido.
            </h3>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrdersPage;
