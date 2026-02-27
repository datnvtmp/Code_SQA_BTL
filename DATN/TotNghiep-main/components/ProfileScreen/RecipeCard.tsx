import { icons } from "@/constants";
import { useRouter } from "next/navigation";
import Image from 'next/image';

import { StaticImageData } from 'next/image';
import Link from "next/link";
import { Recipe } from "@/types/type_index";

// Type definition for recipe item


interface RecipeCardProps {
  item: Recipe;
}

const RecipeCard = ({ item }: RecipeCardProps) => {
  const router = useRouter();
  return (
    <Link
      href={`/table-selection/?collectionId=${item.id}`}
      className="rounded-lg bg-white shadow-sm"
    >
      <div className="flex flex-row">
        <Image unoptimized
          src={item.image}
          alt={item.title}
          width={112}
          height={112}
          className="rounded-tl-lg border-r border-white object-cover h-[110px] w-[100%]"
        />
      </div>
      <div className="px-2 py-2 w-full">
        <p className="w-full font-medium text-start text-black mb-1 justify-start text-sm">
          {item.title}
        </p>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-1">
            <Image unoptimized
              src={icons.saveIcon}
              alt="save"
              width={100}
              height={100}
              className="h-4 w-auto object-contain"
            />
            <span className="text-textNeutralV1 text-start text-xs">
              {item.saves}
            </span>
          </div>
          <span className="text-textNeutralV1 text-xs">
            {item.time}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
