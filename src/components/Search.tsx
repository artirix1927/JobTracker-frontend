import { MagnifyingGlassCircleIcon, MapPinIcon } from "@heroicons/react/16/solid";

export default function Search() {
  return <>
    <div className="search flex my-16 justify-center">
      <div className="flex justify-center flex-row rounded-2xl border-black border bg-white">

        <div className="relative flex items-center">
          <MagnifyingGlassCircleIcon className="w-6 h-6 absolute left-3"/>
          <input className="pl-10 pr-4 py-4 rounded-l-2xl" placeholder="Job title/Company"/>
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        <div className="relative flex items-center">
          <MapPinIcon className="w-6 h-6 absolute left-3"/>
          <input className="pl-10 pr-4 py-4 rounded-r-2xl" placeholder="Location"/>
        </div>

        <button className="mx-1 px-4 my-2 bg-blue-500 rounded-2xl text-white">Find Jobs</button>

      </div>
    </div>
  </>;
}
