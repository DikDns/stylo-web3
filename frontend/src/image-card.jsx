import Card from "./card";
export const ImageCard = ({ imageUrl, ...props }) => {
  return (
    <Card className="relative overflow-hidden rounded-3xl" {...props}>
      <img src={imageUrl} alt="Outfit" className="w-full h-full object-cover" />
    </Card>
  );
};
