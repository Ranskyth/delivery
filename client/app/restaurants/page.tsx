import { Suspense } from "react";
import Restaurants from "./_components/restaurants";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { db } from "../_lib/prisma";
import { serializePrismaObject } from "../_helpers/price";

const RestaurantsPage = async () => {
  const session = await getServerSession(authOptions);
  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      restaurant: true,
    },
  });

  const serializedFavorites = serializePrismaObject(userFavoriteRestaurants);

  return (
    <Suspense>
      <Restaurants userFavoriteRestaurants={serializedFavorites} />
    </Suspense>
  );
};

export default RestaurantsPage;
