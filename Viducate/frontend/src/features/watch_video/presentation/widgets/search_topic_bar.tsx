import { Search } from 'lucide-react';
export function SearchTopicBar() {
    return(
        <div className='relative group flex items-center'>
            <span><Search className=' text-slate-400 absolute w-4 h-4  left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#4f46e5] transition-colors '/></span>
            <input
                type="text"
                placeholder="Search topics..."
                className="placeholder:text-slate-400 w-full bg-white border border-slate-200 shadow-sm rounded-xl py-2 px-10 w-full focus:border-[#4f46e5] focus:ring-[#4f46e5] focus:ring-1 focus:outline-none transition-colors duration-200"
            />
        </div>
    )
}