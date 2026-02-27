'use client';

import { images } from '@/constants';
import { useSuccessStore } from '@/store/successStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

const MobileSuccessScreen = () => {
    const { successTitle, successDesc, resetSuccess, successRedirect } = useSuccessStore();
    const hasRedirectedRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    const handleRedirect = () => {
        if (!hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            resetSuccess();
            router.replace('/');
        }
    };

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            handleRedirect();
        }, 4000);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [successRedirect, router]);

    return (
        <Link
            href={successRedirect as any}
            onClick={handleRedirect}
            className="flex-1 flex flex-col items-center justify-center w-full h-full bg-backgroundV1 border-none p-0 cursor-pointer"
        >
            <div className="px-4 flex flex-col gap-14 justify-center items-center">
                <Image unoptimized
                    src={images.registerSuccess}
                    alt="Success"
                    width={200}
                    height={200}
                    quality={100}
                    draggable={false}
                    className="object-contain w-50 h-50"
                />
                <div className="flex flex-col gap-2 justify-start items-center">
                    <span className="font-medium leading-loose text-center text-black text-xl">
                        {successTitle || 'Tạo công thức nấu ăn thành công!'}
                    </span>
                    <span className="px-4 leading-normal text-center text-textNeutralV1 text-base">
                        {successDesc || 'Bạn đã tạo công thức thành công, về trang chủ để xem tương tác.'}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default MobileSuccessScreen;
