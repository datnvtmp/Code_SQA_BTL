import MobileFoodGrid from '@/components/Common/Mobile/FoodGrid';

const FeaturedRecipesSection = () => {
    return (
        <div className="w-full flex flex-col justify-center items-start px-4">
            <span className="mb-2 font-bold text-black text-base">
                Những món ăn nổi bật
            </span>
            <MobileFoodGrid />
        </div>
    );
};

export default FeaturedRecipesSection;
