import { MagnifyingGlassCircleIcon, MapPinIcon } from "@heroicons/react/16/solid";
import { useState } from "react";


type SearchProps = {
  onSearch: (title: string, address: string) => void;
};

export default function Search({ onSearch }: SearchProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="search flex my-16 justify-center">
      <div className="flex rounded-2xl border bg-white">

        {/* TITLE */}
        <div className="relative flex items-center">
          <MagnifyingGlassCircleIcon className="w-6 h-6 absolute left-3" />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="pl-10 pr-4 py-4 rounded-l-2xl"
            placeholder="Job title / Company"
          />
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        {/* LOCATION (unused for now) */}
        <div className="relative flex items-center">
          <MapPinIcon className="w-6 h-6 absolute left-3" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 pr-4 py-4 rounded-r-2xl"
            placeholder="Location"
          />
        </div>

        <button
          className="mx-2 px-4 my-2 bg-blue-500 rounded-2xl text-white"
          onClick={() => onSearch(title, location)}
        >
          Find Jobs
        </button>
      </div>
    </div>
  );
}