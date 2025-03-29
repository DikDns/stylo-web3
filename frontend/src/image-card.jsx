import React from "react";
import { Card } from "./card.jsx";
export const ImageCard = ({ imageUrl, ...props }) => {
  return (
    <Card className="relative overflow-hidden rounded-3xl" {...props}>
      <img
        src={imageUrl}
        alt="Outfit Image"
        className="w-full h-full object-cover"
      />
    </Card>
  );
};
