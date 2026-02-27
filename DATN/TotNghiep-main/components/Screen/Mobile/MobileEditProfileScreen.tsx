import BackHeader from "@/components/Common/BackHeader";
import Input from "@/components/Common/Input";
import TextArea from "@/components/Common/TextArea";
import { icons, images } from "@/constants";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const MobileEditProfileScreen = () => {
  const [form, setForm] = useState({
    name: 'Hòa Simp',
    bio: '',
    email: 'hoasimp123@gmail.com',
  });
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-backgroundV1">
      <div className="px-4">
        <BackHeader
          headerTitle="Chỉnh sửa hồ sơ"
          onPress={() => router.back()}
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-30 px-4 flex flex-col items-center gap-9 mt-10">
        {/* Avatar Section */}
        <div className="relative h-25">
          <Image unoptimized
            src={images.sampleAvatar}
            alt="Avatar"
            width={100}
            height={100}
            quality={100}
            draggable={false}
            className="object-cover w-25 h-25 rounded-full"
          />
          <button
            className="bg-[#FFEFE9] rounded-full absolute right-0 bottom-0 p-1"
          >
            <Image unoptimized
              src={icons.cameraIcon}
              alt="Camera"
              width={100}
              height={100}
              quality={100}
              draggable={false}
              className="object-contain h-6 w-auto"
              style={{ filter: 'brightness(0) saturate(100%) invert(40%) sepia(93%) saturate(1352%) hue-rotate(346deg) brightness(96%) contrast(87%)' }}
            />
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col justify-start items-start w-full gap-3.5">
          {/* Name Input */}
          <div className="flex flex-col justify-start items-start w-full gap-1">
            <span className="font-bold text-black text-base">
              Tên
            </span>
            <Input
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
              placeholder="Nhập tên của bạn"
            />
          </div>

          {/* Bio Input */}
          <div className="flex flex-col justify-start items-start w-full gap-1">
            <span className="font-bold text-black text-base">
              Giới thiệu
            </span>
            <TextArea
              value={form.bio}
              onChangeText={(value) => setForm({ ...form, bio: value })}
              placeholder="Kể câu chuyện của bạn"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col justify-start items-start w-full gap-1">
            <span className="font-bold text-black text-base">
              Email
            </span>
            <Input
              placeholder="Email"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileEditProfileScreen;
