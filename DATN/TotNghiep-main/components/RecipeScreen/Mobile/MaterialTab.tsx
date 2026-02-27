import Image from 'next/image';
import { icons } from '@/constants';

interface IngredientItem {
  quantity: number;
  unit: string;
  rawName: string;
  displayOrder: number;
}

interface MaterialTabProps {
  data: IngredientItem[];
}

const MaterialTab = ({ data }: MaterialTabProps) => {
  return (
    <div className="px-4 md:px-16 py-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex flex-row items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-black">
            Nguyên liệu
          </h3>

          <Image unoptimized
            src={icons.forwardArrow}
            alt="forward"
            width={20}
            height={20}
            className="grayscale brightness-[0.35]"
          />
        </div>

        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <div
              key={item.displayOrder}
              className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-gray-600 text-base flex-1">
                {item.rawName}
              </span>

              <span className="text-black font-medium text-base text-right">
                {item.quantity} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialTab;
