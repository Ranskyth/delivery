import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";
import { authOptions } from "../_lib/auth";
import { serializePrismaObject } from "../_helpers/price";

const RestaurantList = async () => {
  const session = await getServerSession(authOptions);

  // TODO: pegar restaurantes com maior número de pedidos
  const restaurants = await db.restaurant.findMany({ take: 10 });
  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: { userId: session?.user?.id },
  });

  const serializedRestaurants = serializePrismaObject(restaurants);

  return (
    <div className="flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
      {serializedRestaurants.map((restaurant) => (
        <RestaurantItem
          key={restaurant.id}
          restaurant={restaurant}
          userFavoriteRestaurants={userFavoriteRestaurants}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
