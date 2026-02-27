import { icons, images } from '@/constants';
import { PostItemProps } from '@/types/type_index';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const PostItem = ({ item }: PostItemProps) => {
    const [liked, setLiked] = useState(item.content.likedByCurrentUser ?? false);
    const [saved, setSaved] = useState(item.content.savedByCurrentUser ?? false);
    const [likesCount, setLikesCount] = useState(item.content.likes);
    const [showMenu, setShowMenu] = useState(false);

    const handleLike = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    };

    const handleSave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setSaved(!saved);
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
        <div className="w-full flex flex-col rounded-lg bg-white shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-2">
                <div className="flex items-center gap-2">
                    <Link href={`/profile?id=${item.user.id}`}>
                        <Image unoptimized
                            src={images.sampleAvatar}
                            alt={item.user.name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                        />
                    </Link>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.user.name}</span>
                        <span className="text-xs text-gray-500">{item.user.timeAgo}</span>
                    </div>
                </div>
                <div className="relative">
                    <div onClick={toggleMenu} className="cursor-pointer p-1">
                        <Image unoptimized src={icons.threeDotsIcon} alt="More" width={24} height={24} className="h-6 w-auto" />
                    </div>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
                            <button onClick={(e) => handleMenuAction(e, 'Edit')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                                Edit
                            </button>
                            <button onClick={(e) => handleMenuAction(e, 'Hide')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                                Hide
                            </button>
                            <button onClick={(e) => handleMenuAction(e, 'Delete')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Card Content */}
            <Link href={`/food-detail?id=${item.id}`} className="flex flex-col w-full cursor-pointer">
                <div className="relative w-full h-48 sm:h-56">
                    <Image unoptimized
                        src={item.content.image}
                        alt={item.content.title}
                        fill
                        className="object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/images/sample-food3.jpg'; }}
                    />
                </div>

                <div className="flex flex-col w-full px-3 py-2 gap-2">
                    {/* Like / Comment / Save */}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setLiked(!liked);
                                    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill={liked ? "red" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                </svg>
                                <span className="text-sm font-medium">{likesCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image unoptimized src={icons.chatIcon} alt="Comments" width={20} height={20} className="h-5 w-auto" />
                                <span className="text-sm font-medium">{item.content.comments}</span>
                            </div>
                        </div>
                        <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                e.stopPropagation();
                                setSaved(!saved);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={saved ? "yellow" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div className="flex flex-col gap-1 border-b border-gray-300 pb-2">
                        <span className="text-base font-bold">{item.content.title}</span>
                        <span className="text-xs text-gray-700">{item.content.description}</span>

                        <div className="flex flex-wrap gap-2">
                            {item.content.hashtags.map((tag, idx) => (
                                <span key={idx} className="text-blue-400 text-xs">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PostItem;
