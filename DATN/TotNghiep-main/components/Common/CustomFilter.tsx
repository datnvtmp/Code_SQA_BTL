import { icons } from '@/constants';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface FilterItem {
  id: string;
  name: string;
  isSelected?: boolean;
  isFilter?: boolean;
}

interface CustomFilterProps {
  data: FilterItem[];
  selectedItems: string[];
  onToggleItem: (id: string) => void;

  /** 👉 Chọn tất cả / bỏ chọn tất cả */
  onToggleAll?: () => void;

  renderCustomItem?: (item: FilterItem) => React.ReactNode;
  showFilterIcon?: boolean;

  /** 👉 icon filter đang active hay không */
  isFilterSelected?: boolean;
}

const CustomFilter = ({
  data,
  selectedItems,
  onToggleItem,
  onToggleAll,
  renderCustomItem,
  showFilterIcon = true,
  isFilterSelected = false,
}: CustomFilterProps) => {

  const isSelected = (id: string) => selectedItems.includes(id);

  const renderItemChip = (item: FilterItem) => (
    <button
      key={item.id}
      onClick={() => onToggleItem(item.id)}
      className={`h-8 px-4 rounded-lg flex items-center justify-center transition
        ${isSelected(item.id) ? 'bg-[#E36137]' : 'bg-[#FFEFE9]'}`}
    >
      <p
        className={`font-bold text-sm
          ${isSelected(item.id) ? 'text-white' : 'text-customPrimary'}`}
      >
        {item.name}
      </p>
    </button>
  );

  const filterData = showFilterIcon
    ? [{ id: 'filter', name: 'Filter', isFilter: true }, ...data]
    : data;

  return (
    <div className="h-10 mb-2 w-full">
      <Swiper slidesPerView="auto" spaceBetween={4}>
        {filterData.map(item => (
          <SwiperSlide key={item.id} style={{ width: 'auto' }}>
            <div className="mr-1">
              {item.isFilter ? (
                <button
                  onClick={onToggleAll}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition
                    ${isFilterSelected ? 'bg-[#E36137]' : 'bg-[#FFEFE9]'}`}
                >
                  <Image unoptimized
                    src={icons.activeFunnelIcon}
                    alt="filter"
                    className={`w-5 h-5
                      ${isFilterSelected ? 'brightness-0 invert' : ''}`}
                  />
                </button>
              ) : (
                renderCustomItem
                  ? renderCustomItem(item)
                  : renderItemChip(item)
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomFilter;
