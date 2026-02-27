import { icons } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
interface SearchSuggestionItemProps {
    item: {
        id: string;
        name: string;
        searched: boolean;
    };
}

const SearchSuggestionItem = ({ item }: SearchSuggestionItemProps) => {
    return (
        <Link
            href={`/search/result?query=${encodeURIComponent(item.name)}`}
            className="flex flex-row items-center justify-start bg-transparent w-full gap-2 px-0"
        >
            <Image unoptimized
                src={item.searched ? icons.timerIcon : icons.searchIcon}
                alt={item.name}
                width={24}
                height={24}
            />
            <p
                className="text-textNeutralV1 flex-1 py-2 text-start text-sm"
            >
                {item.name}
            </p>
            {item.searched && (
                <span
                    className="flex items-center justify-center w-6 h-6"
                >
                    <Image unoptimized
                        src={icons.closeIcon}
                        alt="remove"
                        width={24}
                        height={24}
                    />
                </span>
            )}
        </Link>
    );
};

export default SearchSuggestionItem;
