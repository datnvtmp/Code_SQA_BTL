import { useSuccessStore } from '@/store/successStore';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

const slides = [
  {
    title: "Kĩ thuật nấu nướng của bạn hiện tại?",
    options: [
      "Không có kinh nghiệm",
      "Cơ bản",
      "Bình thường",
      "Thành thạo",
      "Chuyên nghiệp"
    ]
  },
  {
    title: "Các chế độ ăn mà bạn quan tâm?",
    options: [
      "Ăn lỏng", "Ít calo", "Giàu calo", "Ăn chay", "Giàu Protein", "Ăn thô", "Không ăn theo chế độ", "Khác"
    ]
  },
  {
    title: "Bạn muốn trải nghiệm văn hóa ẩm thực khu vực nào?",
    options: [
      "Châu Á", "Châu Âu", "Châu Mĩ", "Châu Phi", "Châu Đại Dương", "Châu Nam Cực"
    ]
  }
];

const progressWidths = [33.33, 66.66, 100];

const FavoriteTopicScreen = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selections, setSelections] = useState<(string | null)[]>([null, null, null]);
  const { setSuccess } = useSuccessStore();

  const handleSelectOption = (slideIndex: number, value: string) => {
    const updated = [...selections];
    updated[slideIndex] = value;
    setSelections(updated);

    const isLastSlide = slideIndex === slides.length - 1;
    if (isLastSlide) {
      setSuccess(
        'Bạn đã hoàn thành các câu hỏi!',
        'Tuyệt vời! Lựa chọn của bạn đã được ghi nhận. Chúng tôi sẽ cá nhân hoá gợi ý món ăn phù hợp nhất với khẩu vị của bạn.',
        '/'
      );
      router.replace('/register-success');
    } else {
      const nextIndex = slideIndex + 1;

      // Cập nhật activeIndex NGAY LẬP TỨC
      setActiveIndex(nextIndex);

      // Scroll đến slide tiếp theo (chỉ gọi nếu ref đã sẵn sàng)
      if (swiperRef.current) {
        swiperRef.current.slideTo(nextIndex);
      }
    }
  };

  const handleSkip = () => {
    router.replace('/');
  };

  return (
    <div className="flex h-full bg-backgroundV1 px-4">
      <div className="flex-1">
        {/* Progress bar */}
        <div className="rounded-full w-[calc(100%-32px)] h-1 mt-[23px] mb-[53px] bg-[#FFEFE9]">
          <div
            className="rounded-full bg-customPrimary h-1 transition-all duration-300"
            style={{
              width: `${progressWidths[activeIndex]}%`,
            }}
          />
        </div>

        {/* Swiper */}
        <Swiper
          onSwiper={(swiper: SwiperType) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper: SwiperType) => {
            setActiveIndex(swiper.activeIndex);
          }}
          spaceBetween={0}
          slidesPerView={1}
          className="w-full"
        >
          {slides.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="w-[calc(100%-34px)]">
                <span className="font-bold text-start text-black min-h-[60px] mb-8 text-[22px] block">
                  {item.title}
                </span>

                <div className="gap-2 w-full flex flex-col">
                  {item.options.map((option: any) => (
                    <button
                      key={option}
                      className="w-full px-8 py-3 rounded-lg shadow-md transition-colors"
                      onClick={() => handleSelectOption(index, option)}
                      style={{
                        backgroundColor: selections[index] === option ? '#E36137' : 'white',
                        boxShadow: '0 3px 12px rgba(0,0,0,0.10)',
                      }}
                    >
                      <span
                        className={`font-bold text-start text-base ${selections[index] === option ? 'text-white' : 'text-customPrimary'
                          }`}
                      >
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom helper */}
      <div className="w-full mb-4">
        <span className="mb-2 text-sm text-center font-light text-black block">
          * Chọn đáp án về chủ đề món ăn bạn ưa thích để nhận được các đề xuất phù hợp với bạn.
        </span>
        <button
          className="min-h-[48px] flex justify-center items-center w-full"
          onClick={handleSkip}
        >
          <span className="text-center font-bold text-black text-base">
            Bỏ qua
          </span>
        </button>
      </div>
    </div>
  );
};

export default FavoriteTopicScreen;