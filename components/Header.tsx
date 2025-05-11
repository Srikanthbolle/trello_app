'use client'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import React from 'react'
import Avatar from 'react-avatar'
import { useBoardStore } from '../Store/BoardStore'

const Header = () => {
  const searchString = useBoardStore((state) => state.searchString);
const setSearchString = useBoardStore((state) => state.setSearchString);

  return (
    <header>
      <div className='flex flex-col md:flex-row items-center rounded-b-2xl bg-gray-500/10 p-5'>
        <Image src='https://links.papareact.com/c2cdd5' alt='Trello logo' width={300} height={100} className='w-44 md:w-56 object-contain pb-10 md:pb-0' />
   <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50'/>
    <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
      <form className='flex items-center rounded-md shadow-md bg-white space-x-5 p-2 flex-1 md:flex-initial'>
        <MagnifyingGlassIcon className='w-6 h-6 text-gray-400'/>
        <input type='text' value={searchString} onChange={(e)=>setSearchString(e.target.value)} className='flex-1 outline-none p-2' placeholder='Search'/>
        <button type='submit' hidden>Search</button>
      </form>
      {/* Avatar */}
      <Avatar name="Srikanth Bolle" size='50' round color='#0055D1'/>
    </div>
    </div>
    <div className='flex justify-center items-center py-2 px-5 md:py-5'>
      <p className='flex items-center text-sm font-light p-5 pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]'>
        <UserCircleIcon className='inline-block w-10 h-10 text-[#0055D1] mr-1'/>
        GPT is Summarizing your task for day...
      </p>
    </div>
    </header>

  )
}

export default Header