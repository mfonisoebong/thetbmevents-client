'use client'

import React, {useEffect, useState, type ReactElement, useRef} from 'react'
import Link from "next/link";
import {Dialog, DialogBackdrop, DialogPanel, DialogTitle} from "@headlessui/react";
import {getBaseURL, getEndpoint} from "@lib/utils";

import VideoJS from "@components/VideoJs";
import Player from "video.js/dist/types/player";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

export default function Index(): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // VideoJS Start
  /*const playerRef = useRef<Player| null>(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: `${getBaseURL()}/videos/hls/master.m3u8`,
        type: "application/x-mpegURL"
      }
    ]
  };

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      // videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      // videojs.log('player will dispose');
    });
  };*/
  // VideoJS End

  useEffect(() => {
    if (typeof window === 'undefined') return

    const applyPreference = (isDark: boolean) => {
      if (isDark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    }

    try {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')

      applyPreference(mql.matches)

      const listener = (e: MediaQueryListEvent) => applyPreference(e.matches)

      // Older browsers use addListener; modern use addEventListener
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', listener)

        return () => mql.removeEventListener('change', listener)
      } else if (typeof mql.addListener === 'function') {
        // @ts-ignore -- legacy API
        mql.addListener(listener)

        return () => mql.removeListener(listener)
      }
    } catch (err) {
    }
  }, [])

  return (
    <>
      <main className="lg:grid lg:grid-cols-2 relative z-10 w-full max-w-7xl mx-auto px-6 pt-16 pb-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
            Unforgettable <br className="hidden sm:block"/>
            experiences
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E8B025] to-[#4F8A92] text-gradient-animate"> await you.</span>
          </h1>
          <p className="sm:text-2xl text-text-muted-light dark:text-text-muted-dark mb-10 max-w-2xl leading-relaxed font-light">
            Create stunning events page, invite guests, and sell tickets — bring your gathering to life.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/signup">
              <button
                  className="bg-[#1C1C1C] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Create Your First Event
              </button>
            </Link>
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-4 rounded-xl text-text-muted-light dark:text-text-muted-dark font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
              <span className="material-icons-outlined">play_circle</span>
              See how it works
            </button>
          </div>
        </div>


        {/* Visual Showcase */}
        <div className="hidden lg:block relative justify-self-end w-[400px] h-[500px]">
          {/* Back Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-brand-teal rounded-3xl rotate-[-6deg] opacity-20 blur-sm"></div>

          {/* Middle Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-[45%] -translate-y-[55%] w-80 h-96 bg-brand-yellow rounded-3xl rotate-[6deg] opacity-20 blur-sm"></div>

          {/* Main Glass Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[520px] bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden">

            {/* Decorative Header inside card */}
            <div className="flex justify-between items-center mb-6">
              <div className="w-8 h-8 rounded-full bg-brand-yellow/80"></div>
              <div className="h-2 w-20 bg-slate-200/50 rounded-full"></div>
            </div>

            {/* Content Simulation */}
            <div className="space-y-4">
              <div className="h-32 rounded-2xl bg-brand-gradient w-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-4 left-4 text-white font-bold">Upcoming Event</div>
              </div>

              <div className="flex gap-2">
                <div className="h-24 flex-1 rounded-2xl bg-white/5 border border-white/10 p-3">
                  <div className="w-8 h-8 rounded-full bg-brand-teal/20 mb-2"></div>
                  <div className="h-2 w-16 bg-slate-400/30 rounded-full"></div>
                </div>
                <div className="h-24 flex-1 rounded-2xl bg-white/5 border border-white/10 p-3">
                  <div className="w-8 h-8 rounded-full bg-brand-yellow/20 mb-2"></div>
                  <div className="h-2 w-16 bg-slate-400/30 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="h-3 w-full bg-slate-400/20 rounded-full"></div>
                <div className="h-3 w-3/4 bg-slate-400/20 rounded-full"></div>
                <div className="h-3 w-1/2 bg-slate-400/20 rounded-full"></div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-6">
              <div className="w-full h-12 bg-white text-brand-teal font-bold rounded-xl flex items-center justify-center shadow-lg">
                Book Ticket
              </div>
            </div>
          </div>

          {/* Floating Element 1 */}
          <div className="absolute top-[20%] right-[10%] p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl animate-bounce duration-[3000ms]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs font-bold dark:text-white">RSVP now</span>
            </div>
          </div>

          {/* Floating Element 2 */}
          <div className="absolute bottom-[20%] left-[5%] p-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl shadow-xl border border-brand-yellow/30">
            <div className="text-center">
              <span className="material-icons-outlined block text-2xl text-brand-yellow">language</span>
            </div>
          </div>
        </div>
      </main>

      <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          transition
          className="relative z-50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded-2xl bg-white/80 dark:bg-slate-950/70 border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-xl p-6">
            <DialogTitle className="text-lg font-extrabold text-gray-900 dark:text-white mb-6">See How it Works</DialogTitle>

            <MediaPlayer title="What is TBM?" src={getEndpoint('/hls/master.m3u8')}>
              <MediaProvider />
              <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>

            {/*<VideoJS options={videoJsOptions} onReady={handlePlayerReady} />*/}

          </DialogPanel>
        </div>

      </Dialog>
    </>
  )
}
