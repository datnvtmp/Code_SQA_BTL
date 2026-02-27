import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { PostItemProps } from '@/types/type_index';
import { useAuthStore } from '@/store/useAuthStore';

const PostItem = ({ item }: PostItemProps) => {
  const [liked, setLiked] = useState(item.content.likedByCurrentUser ?? false);
  const [saved, setSaved] = useState(item.content.savedByCurrentUser ?? false);
  const [likesCount, setLikesCount] = useState(item.content.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [collections, setCollections] = useState<{ id: number; name: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const token = useAuthStore.getState().token;
  const id_user = useAuthStore.getState().id;

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCollectionDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const prevLike = liked;
    const prevCount = likesCount;
    setLiked(!prevLike);
    setLikesCount(prevLike ? prevCount - 1 : prevCount + 1);

    try {
      const method = prevLike ? 'DELETE' : 'POST';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/recipes/${item.id}/like`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Like API failed');
    } catch (err) {
      console.error(err);
      setLiked(prevLike);
      setLikesCount(prevCount);
    }
  };

  const handleSaveClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id_user) {
      alert('Bạn cần đăng nhập!');
      return;
    }
    if (collections.length === 0) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/collections/${id_user}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCollections(data.data.content);
      } catch (err) {
        console.error(err);
        return;
      }
    }
    setShowCollectionDropdown(true);
  };

  const handleCollectionAction = async (collectionId: number) => {
    setIsSaving(true);
    setShowCollectionDropdown(false); // Đóng dropdown ngay
    try {
      // Thử add recipe
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/collections/add-recipe/${collectionId}?recipeId=${item.id}`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok && data.status === 200) {
        setSaved(true);
        showToast('Đã lưu vào collection');
      } else if (data.status === 400 && data.message.includes('Công thức này đã có')) {
        // Nếu đã có, tự động remove
        const removeRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_HOST}/api/collections/remove-recipe/${collectionId}?recipeId=${item.id}`,
          { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
        );
        if (removeRes.ok) {
          setSaved(false);
          showToast('Recipe đã có, đã xóa khỏi collection');
        } else {
          showToast('Không thể xóa recipe');
        }
      } else {
        showToast('Thao tác thất bại');
      }
    } catch (err) {
      console.error(err);
      showToast('Thao tác thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const toggleMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuAction = (e: React.MouseEvent<HTMLButtonElement>, action: string) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(action, 'clicked');
    setShowMenu(false);
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Link href={`/profile?id=${item.user.id}`}>
            <Image unoptimized src={item.user.avatar} alt={item.user.name} width={40} height={40} className="rounded-full object-cover" />
          </Link>
          <div className="flex flex-col">
            <span className="font-semibold text-black text-sm">{item.user.name}</span>
            <span className="text-gray-400 text-xs">{item.user.timeAgo}</span>
          </div>
        </div>

        {/* Menu 3 chấm */}
        <div className="relative">
          <div onClick={toggleMenu} className="p-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </div>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
              {['Edit', 'Hide', 'Delete'].map((action) => (
                <button key={action} onClick={(e) => handleMenuAction(e, action)} className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${action === 'Delete' ? 'text-red-500' : ''}`}>
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      <Link href={`/food-detail?id=${item.id}`} className="relative w-full h-52">
        <Image unoptimized src={item.content.image} alt={item.content.title} fill className="object-cover" />
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          {/* Likes */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLike}>
            <svg fill={liked ? 'red' : 'none'} stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <span className="text-sm font-medium">{likesCount}</span>
          </div>

          {/* Save */}
          <div className="relative" ref={dropdownRef}>
            <div className={`cursor-pointer p-1 ${saved ? 'text-yellow-500' : ''}`} onClick={handleSaveClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill={saved ? 'yellow' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </div>

            {showCollectionDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                {collections.map((col) => (
                  <button key={col.id} onClick={() => handleCollectionAction(col.id)} disabled={isSaving} className="w-full px-4 py-2 text-left text-sm hover:bg-purple-100">
                    {col.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Title + description */}
        <h3 className="font-bold text-black">{item.content.title}</h3>
        <p className="text-gray-700 text-sm line-clamp-3">
          {item.content.description}
        </p>


        <div className="flex flex-wrap gap-2 mt-1">
          {item.content.hashtags.map((tag, i) => (
            <span key={i} className="text-blue-500 text-xs">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-md shadow-md z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default PostItem;
