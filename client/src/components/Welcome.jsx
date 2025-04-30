import React, { useContext, useState, useRef, useEffect } from 'react';
import { DappMyMusicContext } from "../context/DappMyMusicContext";
import { VscHome, VscEdit } from "react-icons/vsc";
import { CgDatabase } from "react-icons/cg";
import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import logo from '../../images/dappmymusic_logo_2.png';
import metamask from '../../images/metamask_logo.png';

const Welcome = () => {
    const {connectWallet, currentAccount, getTrackByName, tracks, clearTracks, setTrackByURI, formData, handleChange, handleUpdate, createNewDappMyMusicPost} = useContext(DappMyMusicContext);
    //toggleMenu controls the 'hamburger' menu visibility when screen size is within a certain threshold
    const [toggleMenu, setToggleMenu] = useState(false);
    //makePost used ig yjr user is currently making a post or not
    const [makePost, setMakePost] = useState(false);
    //trackName will be used to search for a track using the Spotify API.
    const [trackName, setTrackName] = useState('');
    //finalTrackName will be used when making the post.
    const [finalTrackName, setFinalTrackName] = useState('');
    //While typing, the trackvalue will chance, the spotify search api needs to be updated with the new value.
    const [debouncedTrackValue, setDebouncedTrackValue] = useState('');
    //artistValue will be populated once a track is selected
    const [artist, setArtist] = useState('');
    //When a track is select while making a post, this will manually prevent searching for a track with the updated trackValue.
    const [isSelecting, setIsSelecting] = useState(false);

    const searchRef = useRef(null);

    //When a track is selected while making a post, this will prevent another spotify search call.
    const updateTrack = (selectedTrackID, selectedTrack, selectedTrackArtist, trackURI) =>{
        setIsSelecting(true);
        setTrackName(selectedTrack);
        setFinalTrackName(selectedTrack);
        setArtist(selectedTrackArtist);
        setTrackByURI(trackURI);
        handleUpdate(selectedTrackID, 'spotifyID');
        handleUpdate(selectedTrack, 'finalTrackName');
        handleUpdate(selectedTrackArtist, 'artist');
        clearTracks();
    };

    //When the user is finished with their post, sends the corresponding inputs to make a post on the blockchain.
    const handleSubmit = (e) =>{
        const { finalTrackName, artist, description} = formData;

        e.preventDefault();
        if(!finalTrackName || !artist || !description) return;

        createNewDappMyMusicPost();
    };
    
    //Used to scroll the 'New Posts'
    const scrollToFeed = () => {
        const sect = document.getElementById("new-posts");
        if (sect) {
            sect.scrollIntoView({behavior: "smooth"});
        }
    }

    //useEffect that adds a listener to handle clicks when making a post. (when clicking outside the input/textarea the popup will close)
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (searchRef.current && !searchRef.current.contains(event.target)) {
            setMakePost(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    //The following two useEffect's handle the debounce effect when making a searching through tracks to make a post.
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTrackValue(trackName);
        }, 500);
        return () => clearTimeout(handler); //cleanup function
    }, [trackName]);

    //After a set amount of time, the debouncedtrackvalue will be updated and cause this useeffect to get a list of tracks with the update value.
    useEffect(() => {
        if (debouncedTrackValue && !isSelecting) {
            getTrackByName(debouncedTrackValue);
        }
        setIsSelecting(false);
    }, [debouncedTrackValue]);

    return (
        <nav className="w-full flex md:justify-center justify-between items-center bg-[#000000] p-4 pb-0">
            <div className="flex flex-row md:flex-[1.5] flex-initial justify-start items-center">
                <img src={logo} alt="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-32 cursor-pointer"/>
                <p className="font-bold">DappMyMusic</p>
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                
                <li className="mx-4 cursor-pointer flex items-center gap-2 hover:text-gray-300 hover:scale-105 transition-all duration-200" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><VscHome/>Home</li> 
                <li className="mx-4 cursor-pointer flex items-center gap-2 hover:text-gray-300 hover:scale-105 transition-all duration-200" onClick={scrollToFeed}><CgDatabase/>Feed</li>
                <li className="mx-4 cursor-pointer flex items-center gap-2 hover:text-gray-300 hover:scale-105 transition-all duration-200" onClick={() => {
                        if (!currentAccount){ 
                            connectWallet();
                        }
                        else{
                            setMakePost(true);
                        }
                    }
                }><VscEdit/>Post</li>
                {!currentAccount && 
                (   
                    <li className="mx-4 cursor-pointer flex items-center gap-2 hover:text-gray-300 hover:scale-105 transition-all duration-200" onClick={connectWallet}><img src={metamask} className="w-6 h-6"/>Connect Metamask</li>
                )}
            </ul>
            {makePost && (
                <div ref={searchRef} className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 p-3 rounded-lg shadow-lg w-80 sm:w-96">
                    <div className="p-5 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <div className="relative w-full">
                            <input type="text" name="trackName" value={trackName} onChange={(e) => setTrackName(e.target.value)} placeholder="Search for a track..." autoComplete="off" className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"/>
                            <ul className="absolute top-full left-0 w-full bg-gray-900 shadow-lg rounded-lg z-10 max-h-48 overflow-y-auto">
                                {tracks.map(track => (
                                    <li key={track.id} onClick={()=> updateTrack(track.id, track.name, track.artists[0].name, track.uri)} className="mx-4 p-2 flex items-center gap-2 border-b cursor-pointer hover:bg-gray-800">
                                        <img src={track.album.images[0].url} className="w-10 h-10"/>
                                        {track.name} - {track.artists[0].name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <input type="text" name="finalTrackName" value={finalTrackName} placeholder="Search for a track first..." readOnly className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"/>
                        <input type="text" name="artist" value={artist} placeholder="Artist name..." readOnly  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"/>
                        <textarea type="text" name="description" placeholder="This song..." onChange={(e) => handleChange(e, 'description')} className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"/>
                        <div className="h-[1px] w-full bg-gray-400 my-2"/>
                        <button type="button" onClick={handleSubmit} className="text-black w-full mt-2 border-[1px] p-2 border-[#3d47c] rounded-full cursor-pointer bg-neutral-200">
                            Post
                        </button>
                    </div>
                </div>
            )}
            <div className="flex relative">
                {
                    toggleMenu
                        ? <AiOutlineClose fontSize={28} className="text-white md:hidden cursor-pointer" onClick={()=> setToggleMenu(false)}/>
                        : <HiMenuAlt4 fontSize={28} className="text-white md:hidden cursor-pointer" onClick={()=> setToggleMenu(true)}/>
                }
                {toggleMenu && (
                    <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2x1 md:hidden list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
                        <li className="text-xl w-full my-2">
                            <AiOutlineClose onClick={() => setToggleMenu(false)} />
                        </li>
                        <li className="mx-4 cursor-pointer my-2 text-lg" onClick={() => {
                            setToggleMenu(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}>
                        Home
                        </li>
                        <li className="mx-4 cursor-pointer my-2 text-lg" onClick={() => {
                            setToggleMenu(false);
                            scrollToFeed();
                        }}>
                        Feed
                        </li>
                        <li className="mx-4 cursor-pointer my-2 text-lg" onClick={() => {
                            setToggleMenu(false);
                            if (!currentAccount) {
                            connectWallet();
                            } else {
                            setMakePost(true);
                            }
                        }}>
                        Post
                        </li>
                        {!currentAccount && (
                            <li className="mx-4 cursor-pointer my-2 text-lg" onClick={() => {
                                setToggleMenu(false);
                                connectWallet();
                            }}>
                                <div className="flex items-center gap-2">
                                    <img src={metamask} className="w-6 h-6" />
                                Connect Metamask
                                </div>
                            </li>
                    )}
                  </ul>
                )}
            </div>
        </nav>
    );
}

export default Welcome;