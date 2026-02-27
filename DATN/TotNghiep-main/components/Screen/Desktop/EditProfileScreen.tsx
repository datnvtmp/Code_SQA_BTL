"use client";

import BackHeader from "@/components/Common/BackHeader";
import Input from "@/components/Common/Input";
import TextArea from "@/components/Common/TextArea";
import { icons, images } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

type EditProfileScreenProps = {
  showHeader?: boolean;
  onBack?: () => void;
  className?: string;
  contentClassName?: string;
};

const EditProfileScreen = ({
  showHeader = true,
  onBack,
  className,
  contentClassName,
}: EditProfileScreenProps) => {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    bio: "",
    dob: "", // YYYY-MM-DD
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string>(
    typeof images.sampleAvatar === "string" ? images.sampleAvatar : images.sampleAvatar.src
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const token = useAuthStore.getState().token;

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data;
        if (data) {
          setForm({
            username: data.username || "",
            bio: data.bio || "",
            dob: data.dob || "",
          });
          setPreviewAvatar(data.avatarUrl || previewAvatar);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };
    fetchUser();
  }, [token]);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("bio", form.bio);
      formData.append("dob", form.dob);
      if (avatarFile) formData.append("avatar", avatarFile);

      await axios.put(`${process.env.NEXT_PUBLIC_API_HOST}/api/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      router.back();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-1 flex-col bg-backgroundV1 h-full",
        !showHeader && "rounded-xl border border-[#E7E7E7] bg-white p-6 shadow-sm",
        className
      )}
    >
      {showHeader && <BackHeader headerTitle="Chỉnh sửa hồ sơ" onPress={handleBack} />}

      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-1 flex-col items-center gap-6 px-4 pb-20",
          !showHeader && "px-0 pb-0",
          contentClassName
        )}
      >
        {/* Avatar Section */}
        <div className="relative h-[100px] w-[100px]">
          <Image unoptimized
            src={previewAvatar}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <label className="absolute left-[68px] top-[68px] rounded-full p-1 bg-[#FFEFE9] cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <Image unoptimized
              src={icons.cameraIcon}
              alt="camera"
              width={24}
              height={24}
              style={{
                filter:
                  "invert(41%) sepia(63%) saturate(1216%) hue-rotate(345deg) brightness(96%) contrast(92%)",
              }}
            />
          </label>
        </div>

        {/* Form Fields */}
        <div className="w-full flex flex-col items-start justify-start gap-4">
          {/* Username */}
          <div className="w-full flex flex-col gap-1">
            <label className="font-bold text-black text-base">Tên người dùng</label>
            <Input
              value={form.username}
              onChangeText={(value) => setForm({ ...form, username: value })}
              placeholder="Nhập tên của bạn"
            />
          </div>

          {/* Bio */}
          <div className="w-full flex flex-col gap-1">
            <label className="font-bold text-black text-base">Giới thiệu</label>
            <TextArea
              value={form.bio}
              onChangeText={(value) => setForm({ ...form, bio: value })}
              placeholder="Kể câu chuyện của bạn"
            />
          </div>

          {/* DOB */}
          <div className="w-full flex flex-col gap-1">
            <label className="font-bold text-black text-base">Ngày sinh</label>
            <Input
              type="date"
              value={form.dob}
              onChangeText={(value) => setForm({ ...form, dob: value })}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary py-3 rounded-lg text-white font-bold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileScreen;
