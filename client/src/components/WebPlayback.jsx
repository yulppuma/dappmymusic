import React, { useState, useEffect, useContext } from 'react';
import { DappMyMusicContext } from '../context/DappMyMusicContext';

const WebPlayback = () => {
    const {player, currentTrack, trackDuration, trackPosition, isPlaying, handleSeek, skipToNextTrack, skipToPreviousTrack} = useContext(DappMyMusicContext);
    
    return (
      <div className="fixed bottom-0 left-0 w-full bg-[#000000] p-3 flex items-center justify-between z-50">
        {/* Left: Track Info */}
        <div className="flex items-center space-x-3 w-[220px] flex-shrink-0 pl-2">
            <img src={currentTrack.playlist.length > 0 ? currentTrack.playlist[currentTrack.index].trackIMG : "/placeholder.png"} 
            className="w-14 h-14 rounded" alt="Track Cover"/>
            <div className="flex flex-col overflow-hidden">
                <h1 className="text-white text-sm truncate">{currentTrack.playlist.length > 0 ? currentTrack.playlist[currentTrack.index].songName : "No track selected"}</h1>
                <p className="text-white text-xs font-light truncate">{currentTrack.playlist.length > 0 ? currentTrack.playlist[currentTrack.index].artistName : ""}</p>
            </div>
        </div>
        <div className="flex flex-col items-center w-full max-w-[700px] min-w-50 space-y-0.1 px-4">
            {/* Progress Bar Row */}
            <div className="w-full flex items-center space-x-3 mt-2">
                {/* Current Time */}
                <span className="text-white text-sm min-w-[50px] text-left">
                    {Math.floor(trackPosition / 60000)}:
                    {String(Math.floor((trackPosition % 60000) / 1000)).padStart(2, '0')}
                </span>

                {/* Progress Bar */}
                <div className="flex-1 h-2 bg-gray-800 rounded cursor-pointer relative" onClick={(e) => handleSeek(e)}>
                    <div className="h-2 bg-blue-500 rounded" style={{ width: `${(trackPosition / trackDuration) * 100}%` }}/>
                </div>
                {/* Total Duration */}
                <span className="text-white text-sm min-w-[50px] text-right">
                    {Math.floor(trackDuration / 60000)}:
                    {String(Math.floor((trackDuration % 60000) / 1000)).padStart(2, '0')}
                </span>
            </div>
            {/* Player Controls */}
            <div className="flex space-x-4 items-center justify-center">
                <button onClick={() => skipToPreviousTrack()} className="focus:outline-none border-transparent">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#3172E1" strokeWidth="2">
                        <polygon points="19 20 9 12 19 4 19 20" />
                        <line x1="5" y1="19" x2="5" y2="5" />
                    </svg>
                </button>
                <button onClick={() => player.togglePlay()} className="rounded-full flex items-center justify-center focus:outline-none border-transparent">
                    {isPlaying ? (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#3172E1" stroke="#3172E1" strokeWidth="2">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#3172E1" stroke="#3172E1" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    )}
                </button>
                <button onClick={() => skipToNextTrack()} className="focus:outline-none border-transparent">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#3172E1" strokeWidth="2">
                        <polygon points="5 4 15 12 5 20 5 4" />
                        <line x1="19" y1="5" x2="19" y2="19" />
                    </svg>
                </button>
            </div>
        </div>
        {/* Right: Spacer or future features (volume, repeat, next song, etc.) */}
        <div className="hidden md:flex w-[150px] md:w-[220px] flex-shrink">
          By: Yul Puma
          yulppuma@gmail.com
        </div>
  </div>
    );
}

export default WebPlayback;