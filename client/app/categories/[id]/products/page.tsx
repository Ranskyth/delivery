import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { Button } from "@/app/_components/ui/button";
import { db } from "@/app/_lib/prisma";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serializePrismaObject } from "@/app/_helpers/price";

interface CategoriesPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const { id } = await params;
  const category = await db.category.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    return notFound();
  }

  const serializedProducts = serializePrismaObject(category.products);

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <div className="mb-6 inline-flex items-center  justify-center">
          <div className="hidden md:block">
            <Button
              className=" rounded-full 
            border border-solid border-muted-foreground bg-muted text-foreground shadow-sm"
              size="icon"
              asChild
            >
              <Link href="/">
                <ChevronLeftIcon />
              </Link>
            </Button>
          </div>

          <h2 className="pl-0 text-lg font-semibold md:pl-4 ">
            {category.name}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {serializedProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              className="min-w-full"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
