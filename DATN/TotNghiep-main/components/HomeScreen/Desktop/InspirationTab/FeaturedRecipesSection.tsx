import FoodGrid from '@/components/Common/Desktop/FoodGrid';

const FeaturedRecipesSection = () => {
    return (
        <div
            className="w-full px-16 flex flex-col items-start justify-center"
        >
            <p
                className="font-bold text-black mb-2 text-base"
            >
                Những món ăn nổi bật
            </p>

            <FoodGrid />
        </div>
    );
};

export default FeaturedRecipesSection;
