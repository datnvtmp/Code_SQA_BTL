import { icons } from "@/constants";
import {  RecipeItem } from "@/types/type_index";
import Image from 'next/image';
import { StaticImageData } from 'next/image';


interface RecipeListItemProps {
  item: RecipeItem;
}

const RecipeListItem = ({ item }: RecipeListItemProps) => (
  <div
    className="flex flex-row rounded-lg bg-white cursor-pointer shadow-md h-36 sm:h-36 md:h-36 lg:h-36"
  >
    <Image unoptimized
      src={item.images[0]}
      alt={item.title}
      width={100}
      height={100}
      className="rounded-tl-lg rounded-bl-lg object-cover"
    />
    <div
      className="px-3 py-2 gap-2 flex-1 flex flex-col"
    >
      <div>
        <span className="font-semibold text-sm text-black">
          {item.title}
        </span>
        <span
          className="text-black line-clamp-3 leading-5 text-xs"
        >
          {item.description}
        </span>
      </div>
      <div
        className="flex flex-row gap-2"
      >
        <div className="flex flex-row items-center gap-1">
          <Image unoptimized
            src={icons.heartIcon}
            alt="heart"
            width={50}
            height={50}
            quality={100}
            className="h-4 w-auto object-contain"
          />
          <span className="font-medium text-black text-sm">
            {item.likes}
          </span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <Image unoptimized
            src={icons.chatIcon}
            alt="chat"
            width={50}
            height={50}
            quality={100}
            className="h-4 w-auto object-contain"
          />
          <span className="font-medium text-black text-sm">
            {item.comments}
          </span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <Image unoptimized
            src={icons.saveIcon}
            alt="save"
            width={50}
            height={50}
            quality={100}
            className="h-4 w-auto object-contain"
          />
          <span className="font-medium text-black text-sm">
            {item.saves}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default RecipeListItem;
