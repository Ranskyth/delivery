import { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

import { OrderStatus, Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { useRouter } from "next/navigation";
import { createOrder } from "./_actions/order";
import { toast } from "sonner";
import { Icons } from "./icons";


interface CartProps {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
}

const Cart = ({ setIsOpen }: CartProps) => {
  const router = useRouter();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined);
  

  const { data } = useSession();

  const { products, subtotalPrice, totalPrice, totalDiscounts, clearCart } =
    useContext(CartContext);

  const handleFinishOrderClick = async () => {

    if (!data?.user) {
      setIsLoginDialogOpen(true);
      return;
    }
    const restaurant = products[0].restaurant;
    
    try {
      setIsSubmitLoading(true);

    /*await createOrder({
        subtotalPrice,
        totalDiscounts,
        totalPrice,
        paymentMetodo: paymentMethod!,
        deliveryFee: restaurant.deliveryFee,
        deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: { id: restaurant.id },
        },
        status: OrderStatus.CONFIRMED,
        user: {
          connect: { id: data.user.id },
        },
        products: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });
      */
      clearCart();
      setIsOpen(false);

      toast("Pedido finalizado com sucesso!", {
        description: "Você pode acompanhá-lo na tela dos seus pedidos.",
        action: {
          label: "Meus Pedidos",
          onClick: () => router.push("/my-orders"),
        },
        duration: 10000,
      });

      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleContinueShoppingClick = () => {
    setIsOpen(false);
    router.push("/");
  };

  return (
    <>
      <div className="flex h-full flex-col py-5">
        {products.length > 0 ? (
          <>
            <div className="flex-auto overflow-x-auto space-y-4">
              {products.map((product) => (
                <CartItem key={product.id} cartProduct={product} />
              ))}
            </div>

            {/* TOTAIS */}
            <div className="mt-6">
              <Card>
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotalPrice)}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Descontos</span>
                    <span>- {formatCurrency(totalDiscounts)}</span>
                  </div>

                  <Separator className="h-[0.5px]" />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Entrega</span>

                    {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                      <span className="uppercase text-primary">Grátis</span>
                    ) : (
                      formatCurrency(
                        Number(products?.[0].restaurant.deliveryFee),
                      )
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FINALIZAR PEDIDO */}
            <Button
              className="mt-6 w-full"
              onClick={() => setIsConfirmDialogOpen(true)}
              disabled={isSubmitLoading}
            >
              Finalizar pedido
            </Button>
          </>
        ) : (
          <h2 className="text-left font-medium">Sua sacola está vazia.</h2>
        )}
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Formas de Pagamento
            </DialogTitle>
            <DialogDescription className="text-center">
              Escolha como deseja pagar pelo seu pedido.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-2">
            {([
              { label: "Cartão", tag: "Na entrega" },
              { label: "Dinheiro", tag: "Na entrega" },
              { label: "PIX", tag: "Online" },
            ]).map(({ label, tag }) => (
              <Button
                key={label}
                variant={paymentMethod === label ? "default" : "outline"}
                className="relative h-14 flex-col gap-1 text-sm"
                onClick={() => setPaymentMethod(label)}
              >
                {label}
                <span className="text-[10px] font-normal opacity-70">{tag}</span>
              </Button>
            ))}
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>

            <Button
              className="gap-2 border border-input hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleContinueShoppingClick}
              variant="secondary"
            >
              Continuar Comprando
            </Button>

            <Button
              onClick={() => handleFinishOrderClick()}
              disabled={isSubmitLoading || !paymentMethod}
            >
              {isSubmitLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Você precisa estar logado para continuar.
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex gap-2 sm:justify-center md:justify-center lg:justify-center">
            <DialogClose asChild>
              <Button variant="outline" className="mt-0 w-full md:w-24">
                Cancelar
              </Button>
            </DialogClose>

            <Button
              className="w-full md:w-24"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart;
