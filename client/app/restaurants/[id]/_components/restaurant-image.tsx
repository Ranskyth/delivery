"use client";

import { Button } from "@/app/_components/ui/button";
import { isRestaurantFavorited } from "@/app/_helpers/restaurant";
import useToggleFavoriteRestaurant from "@/app/_hooks/use-toggle-favorite-restaurant";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { ChevronLeftIcon, HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RestaurantImageProps {
  restaurant: Pick<Restaurant, "id" | "name" | "imageUrl">;
  userFavoriteRestaurants: UserFavoriteRestaurant[];
}

const RestaurantImage = ({
  restaurant,
  userFavoriteRestaurants,
}: RestaurantImageProps) => {
  const { data } = useSession();

  const router = useRouter();

  const isFavorite = isRestaurantFavorited(
    restaurant.id,
    userFavoriteRestaurants,
  );

  const { handleFavoriteClick } = useToggleFavoriteRestaurant({
    restaurantId: restaurant.id,
    userId: data?.user.id,
    restaurantIsFavorited: isFavorite,
  });

  const handleBackClick = () => router.back();

  return (
    <div className="relative h-[250px] w-full md:h-full">
      <Image
        src={restaurant.imageUrl}
        alt={restaurant.name}
        fill
        sizes="100%"
        className="object-cover md:rounded-lg"
      />

      <Button
        className="absolute left-4 top-4 rounded-full bg-background text-foreground hover:text-primary-foreground"
        size="icon"
        onClick={handleBackClick}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size="icon"
        className={`absolute right-4 top-4 rounded-full bg-muted ${isFavorite && "bg-primary hover:bg-muted"}`}
        onClick={handleFavoriteClick}
      >
        <HeartIcon size={20} className="fill-primary-foreground" />
      </Button>
    </div>
  );
};

export default RestaurantImage;
