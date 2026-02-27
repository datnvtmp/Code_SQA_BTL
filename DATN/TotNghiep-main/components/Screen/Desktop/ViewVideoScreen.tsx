'use client';

import { icons, images, videos } from '@/constants';
import Image from 'next/image';

const mockSteps = [
  {
    id: 1,
    stepNumber: '✓',
    title: 'Chuẩn bị gà',
    description: 'Đặt gà vào một tô lớn, rồi thoa đều dầu ăn, muối và tiêu đen lên mỗi miếng gà. Massage nhẹ nhàng để gia vị thấm đều. Để gà ủ trong tủ lạnh ít nhất 1 giờ hoặc qua đêm cho gia vị ngấm vào thịt.',
    isCompleted: true,
    showLine: true,
    images: [images.sampleFood1, images.sampleFood2, images.sampleFood3],
  },
  {
    id: 2,
    stepNumber: '2',
    title: 'Chuẩn bị sốt tiêu đen',
    description: 'Trong một chảo nhỏ, đun nóng dầu ăn, sau đó thêm tỏi băm vào và chiên cho đến khi thơm.\n\nTiếp theo, thêm nước mắm, đường nâu, nước cốt chanh, và tiêu đen xay vào chảo. Đảo đều các thành phần cho đến khi đường tan hết và sốt sệt lại. Sau đó, tắt bếp và để sốt nguội.',
    isCompleted: false,
    showLine: true,
    images: [images.sampleFood1, images.sampleFood2],
  },
  {
    id: 3,
    stepNumber: '3',
    title: 'Nướng gà',
    description: 'Trước khi nướng, hâm nóng lò nướng ở nhiệt độ 180-200 độ C.\n\nĐặt miếng gà đã ủ trên khay nướng, nướng trong lò khoảng 30-40 phút hoặc cho đến khi gà chín và vàng đều hai mặt. Trong quá trình nướng, có thể lật gà một lần để đảm bảo nướng đều.',
    isCompleted: false,
    showLine: true,
    images: [images.sampleFood1],
  },
  {
    id: 4,
    stepNumber: '4',
    title: 'Hoàn thành',
    description: 'Khi gà đã chín vàng đều, đặt lên dĩa và rưới sốt tiêu đen lên trên. Bạn cũng có thể dùng sốt để tráng gà trước khi nướng cuối cùng khoảng 5-10 phút.\n\nThưởng thức gà nướng tiêu đen nóng hổi cùng với cơm trắng, salad hoặc một loại rau sống theo sở thích.\n',
    isCompleted: false,
    showLine: false,
    images: [images.sampleFood1, images.sampleFood2],
  },
];

const ViewVideoScreen = () => {
  const renderStepItem = ({ item, index }: { item: typeof mockSteps[0]; index: number }) => {
    return (
      <div 
        className={`flex flex-row gap-4 px-3 ${index === 0 ? 'pt-6' : ''} ${index === mockSteps.length - 1 ? 'pb-4' : ''}`}
      >
        {/* Step Number with Line */}
        <div className="flex items-center gap-1 flex-col">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              item.isCompleted ? 'bg-[#E36137]' : 'bg-[#9CA3AF]'
            }`}
          >
            {item.isCompleted ? (
              <Image unoptimized
                src={icons.check2Icon}
                alt="done"
                width={16}
                height={16}
              />
            ) : (
              <span className="text-[#EEEEEE] text-sm">
                {item.stepNumber}
              </span>
            )}
          </div>
          {item.showLine && index < mockSteps.length - 1 && (
            <div
              className={`flex-1 w-px ${
                item.isCompleted ? 'bg-[#E36137]' : 'bg-[#9CA3AF]'
              }`}
            />
          )}
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p 
              className={`m-0 text-sm ${
                item.isCompleted ? 'text-[#E36137]' : 'text-[#9CA3AF]'
              }`}
            >
              {item.title}
            </p>
            <p className={`m-0 text-sm whitespace-pre-line ${
                item.isCompleted ? 'text-[#EEEEEE]' : 'text-[#595959]'
              }`}
            >
              {item.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-backgroundV1 min-h-dvh">
      <div className="flex flex-row h-full">
        {/* Video Section */}
        <div className="flex-[2] flex justify-end items-end">
          <div className="w-full h-full relative overflow-hidden bg-black">
            <video
              className="w-full h-full"
              src={videos.videoTutorial as unknown as string}
              controls
            />
          </div>
        </div>

        {/* Steps List */}
        <div 
          className="flex-1 bg-[#2D2D2D] overflow-y-auto"
        >
          {mockSteps.map((item, index) => (
            <div key={item.id}>
              {renderStepItem({ item, index })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewVideoScreen;

