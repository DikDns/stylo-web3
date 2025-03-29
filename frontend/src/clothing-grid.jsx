import React from "react";
import { ImageCard } from "./image-card.jsx";

export const ClothingGrid = ({ clothingIds, clothings }) => {
  if (!clothingIds || !clothings || clothingIds.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      {clothingIds.map((id) => {
        const clothing = clothings.find((item) => item.id === id);
        if (!clothing) return null;

        return (
          <div key={clothing.id} className="bg-white shadow rounded-lg p-3">
            <ImageCard
              imageUrl={clothing.image_url}
              className="aspect-square"
            />
          </div>
        );
      })}
    </div>
  );
};
