'use client';

import { videos } from '@/constants';
import { useEffect, useRef, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@api/QueryKey';
import ApiHome from '@api/ApiHome';
import { Check } from 'lucide-react';

type StepItem = {
  title: string;
  description: string;
  start: number;
  end: number;
};

const MobileViewVideoScreen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastStepRef = useRef<number>(-1);

  const searchParams = useSearchParams();

  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  /* ================= GET recipeId ================= */
  const recipeId = useMemo(() => {
    const id = searchParams.get('recepieId');
    return id ? Number(id) : 1;
  }, [searchParams]);

  /* ================= CALL API ================= */
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.Recipes.GET_LIST_RECICPE, recipeId],
    queryFn: () => ApiHome.getIngredientsData(recipeId),
    staleTime: 5 * 60 * 1000,
  });

  const videoUrl = data?.data.videoUrl || videos.videoTutorial;

  /* ================= BUILD STEPS ================= */
  const steps: StepItem[] = useMemo(() => {
    const apiSteps = data?.data.steps ?? [];
    if (!apiSteps.length || !videoDuration) return [];

    const stepDuration = videoDuration / apiSteps.length;

    return apiSteps.map((s: any, index: number) => ({
      title: `Bước ${index + 1}`,
      description: s.description,
      start: index * stepDuration,
      end: (index + 1) * stepDuration,
    }));
  }, [data, videoDuration]);

  /* ================= VIDEO TIME ================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, []);

  /* ================= CURRENT STEP INDEX ================= */
  const currentStepIndex = useMemo(() => {
    return steps.findIndex(
      step => currentTime >= step.start && currentTime < step.end
    );
  }, [currentTime, steps]);

  /* ================= AUTO SCROLL (ONLY WHEN STEP CHANGES) ================= */
  useEffect(() => {
    if (currentStepIndex === -1) return;
    if (lastStepRef.current === currentStepIndex) return;

    lastStepRef.current = currentStepIndex;

    stepRefs.current[currentStepIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [currentStepIndex]);

  /* ================= ORIENTATION ================= */
  useEffect(() => {
    const handleRotate = () => {
      if (!containerRef.current) return;
      const portrait = window.innerHeight > window.innerWidth;

      if (portrait) {
        Object.assign(containerRef.current.style, {
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          width: `${window.innerHeight}px`,
          height: `${window.innerWidth}px`,
        });
      } else {
        containerRef.current.style.transform = '';
      }
    };

    handleRotate();
    window.addEventListener('resize', handleRotate);
    return () => window.removeEventListener('resize', handleRotate);
  }, []);

  /* ================= UI ================= */
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-screen bg-black overflow-hidden">
      {/* VIDEO */}
      <div className="flex-[2]">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          playsInline
          onLoadedMetadata={() =>
            setVideoDuration(videoRef.current?.duration || 0)
          }
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* STEPS */}
      <div className="flex-1 bg-[#1F1F1F] overflow-y-auto">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isDone = index < currentStepIndex;

          return (
            <div
              key={index}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}

              className={`flex gap-4 px-4 py-3 ${isActive ? 'bg-[#2A2A2A]' : ''
                }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center
                    ${isDone
                      ? 'bg-green-500'
                      : isActive
                        ? 'bg-orange-500'
                        : 'bg-gray-600'}`}
                >
                  {isDone ? (
                    <Check size={14} className="text-white" />
                  ) : (
                    <span className="text-white text-sm">{index + 1}</span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="text-sm font-semibold text-orange-300">
                  {step.title}
                </div>
                <div className="text-sm text-gray-300">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileViewVideoScreen;
