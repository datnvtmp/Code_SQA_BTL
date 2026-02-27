'use client';

import { images } from '@/constants';
import { useSuccessStore } from '@/store/successStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

const SuccessScreen = () => {
    const { successTitle, successDesc, resetSuccess, successRedirect } = useSuccessStore();
    const hasRedirectedRef = useRef(false);
    const timerRef = useRef<number | null>(null);
    const router = useRouter();

    const handleRedirect = useCallback(() => {
        if (!hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            resetSuccess();
            router.replace(successRedirect);
        }
    }, [resetSuccess, router, successRedirect]);

    useEffect(() => {
        timerRef.current = window.setTimeout(() => {
            handleRedirect();
        }, 4000);
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [successRedirect, handleRedirect]);

    return (
        <button onClick={handleRedirect} className="min-h-dvh w-full bg-backgroundV1 flex-1">
            {/* Main Content */}
            <div
                className="mx-auto flex max-w-2xl flex-col items-center justify-center mt-[125px] gap-[55px] px-4"
            >
                <Image unoptimized
                    className="w-[200px] h-[200px]"
                    src={images.registerSuccess}
                    alt="success"
                />
                <div
                    className="flex flex-col items-center justify-start gap-2"
                >
                    <p
                        className="text-center font-medium leading-loose text-black text-xl"
                    >
                        {successTitle || 'Đăng ký thành công!'}
                    </p>
                    <p
                        className="text-center leading-normal text-textNeutralV1 px-4 text-base"
                    >
                        {successDesc || 'Bạn đã đăng ký thành công, vui lòng đăng nhập với tài khoản mới của bạn.'}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default SuccessScreen;
