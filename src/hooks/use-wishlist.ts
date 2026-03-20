"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useWishlist() {
  const wishlist = useQuery(api.wishlist.list) ?? [];
  const addItem = useMutation(api.wishlist.add);
  const updateItem = useMutation(api.wishlist.update);
  const deleteItem = useMutation(api.wishlist.remove);

  return { wishlist, addItem, updateItem, deleteItem };
}
