import React, { useContext, useState } from 'react';
import { DappMyMusicContext } from "../context/DappMyMusicContext";
import { AiFillHeart } from "react-icons/ai";



const Music = () => {
    
    const {player, currentTrack, trackDuration, trackPosition, isPlaying, handleSeek,  currentAccount, allMyPosts, allDappMyMusicPosts, 
        allMyTop5Posts, setTrackByURI, addToMyTop5, removeFromMyTop5, setNextTrack, skipToNextTrack, skipToPreviousTrack} = useContext(DappMyMusicContext);

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background image layer (if there's a track image) */}
            {currentTrack?.playlist?.[currentTrack.index]?.trackIMG && (
            <div className="fixed inset-0 w-full h-full z-0 bg-cover bg-center blur-xl brightness-50 transition-opacity duration-500 animate-pulse"
                style={{ backgroundImage: `url(${currentTrack?.playlist?.[currentTrack.index]?.trackIMG})` }}/>
            )}
            {/*Glassmorphism overlay layer*/}
            {currentTrack?.playlist?.[currentTrack.index]?.trackIMG && (
            <div className="fixed inset-0 w-full h-full z-10 bg-black/40 backdrop-blur-sm" />
            )}
            <div className="relative z-20 max-w-full px-6 overflow-hidden">
                <div className="flex flex-col w-full justify-start justify-between pt-35">
                    {/* My Top 5 Posts*/}
                    <div className="flex ml-6">
                        <h1 className="text-[#036AA4] font-bold">My Top 5</h1>
                    </div>
                    <div className="flex flex-col w-full">
                        <ul className="flex flex-col w-full">
                            {currentAccount ? 
                                (allMyTop5Posts.length > 0 ?
                                    allMyTop5Posts.map((post, index) => (
                                        <li key={index} className="flex flex-row w-full min-h-[200px] max-h-[200px] p-6 bg-[#000000] rounded-xl shadow-md overflow-auto mb-4 ml-6 mr-4 border-4 border-[#036AA4]">
                                            <div className="flex flex-col items-start min-w-[200px] max-w-[250px]">
                                                <img src={post.trackIMG} onClick={() => {
                                                    setTrackByURI(post.trackURI);
                                                    setNextTrack(allMyTop5Posts, index);
                                                    }
                                                } className="w-25 h-25 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:brightness-110"/>
                                                <h1 className="text-left text-white">{post.songName}</h1>
                                                <p className="text-left text-white font-light">{post.artistName}</p>
                                                <p className="text-left font-light text-gray-500">Posted by: {post.userName}</p>
                                                <p className="text-left text-gray-500">Date: {new Date(Number(post.creationDate)* 1000).toLocaleDateString()}</p>
                                                <p onClick={() => removeFromMyTop5(index)} className="cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:brightness-110"><AiFillHeart size={20} fill="#FFC0CB"/></p>
                                            </div>
                                            <div className="flex-1">
                                            <p className="text-balance text-left text-white">{post.description}</p>
                                            </div>
                                        </li>
                                    ))
                                    : (
                                        <li className="flex items-center justify-center w-full min-h-[200px] max-h-[200px] p-6 bg-[#000000] rounded-xl shadow-md mb-4 ml-6 mr-4 border-4 border-[#036AA4]">
                                            <p className="text-white flex-row flex"><AiFillHeart size={20} fill="#FFC0CB"/>Add posts to your Top 5!<AiFillHeart size={20} fill="#FFC0CB"/></p>
                                        </li>
                                    )
                                )
                                : (
                                    <li className="flex items-center justify-center w-full min-h-[200px] max-h-[200px] p-6 bg-[#000000] rounded-xl shadow-md mb-4 ml-6 mr-4 border-4 border-[#036AA4]">
                                        <p className="text-white text-center">Connect your wallet and add to your Top 5!</p>
                                    </li>
                                )}
                        </ul>
                    </div>
                    {/* My Posts */}
                    <div className="flex ml-6">
                        <h1 className="text-[#036AA4] font-bold">My Posts</h1>
                    </div>
                    <div className="flex flex-col w-full">
                        <ul className="flex flex-col w-full">
                            {currentAccount ? 
                                (allMyPosts.length > 0 ?
                                    allMyPosts.slice().reverse().map((post, index) => (
                                        <li key={index} className="flex flex-row w-full min-h-[200px] max-h-[200px] p-6 bg-[#000000] rounded-xl shadow-md overflow-auto mb-4 ml-6 mr-4 border-4 border-[#036AA4]">
                                            <div className="flex flex-col items-start min-w-[200px] max-w-[250px]">
                                                <img src={post.trackIMG} onClick={() => {
                                                    setTrackByURI(post.trackURI);
                                                    setNextTrack(allMyPosts.slice().reverse(), index);
                                                    }
                                                } className="w-25 h-25 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:brightness-110"/>
                                                <h1 className="text-left text-white">{post.songName}</h1>
                                                <p className="text-left text-white font-light">{post.artistName}</p>
                                                <p className="text-left font-light text-gray-500">Posted by: {post.userName}</p>
                                                <p className="text-left text-gray-500">Date: {new Date(Number(post.creationDate)* 1000).toLocaleDateString()}</p>
                                                <p onClick={() => addToMyTop5({
                                                    user: post.user,
                                                    userName: post.userName,
                                                    spotifyID: post.spotifyID,
                                                    songName: post.songName,
                                                    artistName: post.artistName,
                                                    description: post.description,
                                                    creationDate: post.creationDate
                                                })} className="cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:brightness-110"><AiFillHeart size={20} fill="#FFC0CB"/></p>
                                            </div>
                                            <div className="flex-1">
                                            <p className="text-balance text-left text-white">{post.description}</p>
                                            </div>
                                        </li>
                                    ))
                                    : (
                                        <li className="flex items-center justify-center w-full min-h-[200px] max-h-[200px] p-6 bg-[#000000] rounded-xl shadow-md mb-4 ml-6 mr-4 border-4 border-[#036AA4]">
                                            <p className="text-white text-center">Make your first post!</p>
                                        </li>
                                    )
                                )
                                : (
                                    <li className="flex items-center justify-center w-full min-h-[200px] max-h-[200px] p-6 bg-[#000000] rounded-xl shadow-md mb-4 ml-6 mr-4 border-4 border-[#036AA4]">
                                        <p className="text-white text-center">Connect your wallet and make a post!</p>
                                    </li>
                                )}
                        </ul>
                    </div>
                    {/* All Posts */}
                    <div className="flex ml-6 scroll-mt-35" id="new-posts">
                        <h1 className="text-[#036AA4] font-bold">New Posts</h1>
                    </div>
                    <div className="flex flex-col w-full pb-15">
                        <ul className="flex flex-col w-full">
                            {allDappMyMusicPosts.length > 0 ?
                                allDappMyMusicPosts.slice().reverse().map((post, index) => (
                                        <li key={index} className="flex flex-row w-full min-h-[200px] max-h-[200px] p-6 bg-[#000000] rounded-xl shadow-md overflow-auto mb-4 ml-6 mr-4 border-4 border-[#036AA4]">
                                            <div className="flex flex-col items-start min-w-[200px] max-w-[250px]">
                                                <img src={post.trackIMG} onClick={() => {
                                                    setTrackByURI(post.trackURI);
                                                    setNextTrack(allDappMyMusicPosts.slice().reverse(), index);
                                                    }
                                                } className="w-25 h-25 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:brightness-110"/>
                                                <h1 className="text-left text-white">{post.songName}</h1>
                                                <p className="text-left text-white font-light">{post.artistName}</p>
                                                <p className="text-left font-light text-gray-500">Posted by: {post.userName}</p>
                                                <p className="text-left text-gray-500">Date: {new Date(Number(post.creationDate)* 1000).toLocaleDateString()}</p>
                                                <p onClick={() => addToMyTop5({
                                                    user: post.user,
                                                    userName: post.userName,
                                                    spotifyID: post.spotifyID,
                                                    songName: post.songName,
                                                    artistName: post.artistName,
                                                    description: post.description,
                                                    creationDate: post.creationDate
                                                })} className="cursor-pointer"><AiFillHeart size={20} fill="#FFC0CB"/></p>
                                            </div>
                                            <div className="flex-1">
                                            <p className="text-balance text-left text-white">{post.description}</p>
                                            </div>
                                        </li>
                                )) : (
                                        <li className="flex items-center justify-center w-full min-h-[200px] max-h-[200px] p-6 bg-[#000000] rounded-xl shadow-md mb-4 ml-6 mr-4 border-2 border-[#036AA4]">
                                            <p className="text-white text-center">Getting posts!</p>
                                        </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Music;