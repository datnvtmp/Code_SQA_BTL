"use client";

import React from "react";
import Image from "next/image";
import { icons } from "@/constants";

interface SearchInputProps {
    placeholder?: string;
    onSearch?: (value: string) => void;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = "Tìm kiếm",
    onSearch,
    className = "",
}) => {
    const [searchValue, setSearchValue] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    return (
        <div
            className={`flex flex-row items-center gap-4 bg-white rounded-lg flex-1 h-8 px-2 ${className}`}
        >
            <Image unoptimized
                src={icons.searchIcon}
                alt="Search"
                width={100}
                height={100}
                quality={100}
                draggable={false}
                className="object-contain h-6 w-auto"
            />
            <input
                type="text"
                value={searchValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="font-medium text-textNeutralV1 text-sm bg-transparent border-none outline-none flex-1"
            />
        </div>
    );
};

export default SearchInput;

