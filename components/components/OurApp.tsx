import React from 'react';
// import demo from '../video/demo.mp4';
// import Demo from "@/components/components/video/demo.mp4"
import Link from 'next/link';
import { Suspense } from 'react'

const OurApp = () => {
  return (
    <div id="about-app" className="section-p1 bg-[#ccd5d4]">
      <h1 className='text-center text-lg md:text-xl lg:text-3xl py-6 font-semibold'>
        Download Our <Link href="/" className='text-green-800 font-bold cursor-pointer underline'>App</Link>
      </h1>
      <div className='flex justify-center'>
        <Suspense fallback={<h1>Loading</h1>}>
        <video 
          autoPlay 
          muted 
          loop 
          className="w-full h-auto lg:size-8/12 rounded-4xl"
        >
          <source src={"/banner.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        </Suspense>
      </div>
    </div>
  );
}

export default OurApp;