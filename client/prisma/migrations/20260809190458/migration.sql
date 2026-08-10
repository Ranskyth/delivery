-- AlterTable
ALTER TABLE "_CategoryToRestaurant" ADD CONSTRAINT "_CategoryToRestaurant_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CategoryToRestaurant_AB_unique";
