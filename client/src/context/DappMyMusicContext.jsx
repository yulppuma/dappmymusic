import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';

import { contractABI, contractAddress } from '../utils/constants';
import { spotifyClientID } from '../utils/constants';

export const DappMyMusicContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = async () => {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const DMMContract = new ethers.Contract(contractAddress, contractABI, signer);
    return DMMContract;
}

export const DappMyMusicProvider = ({ children }) => {
    //Connect metamask wallet.
    const [currentAccount, setCurrentAccount] = useState('');
    //if there is an access_token, set to true, otherwise there is no authorization.
    const [isAuthorized, setIsAuthorized] = useState(!!localStorage.getItem('access_token'));
    //This is the Spotify Web player.
    const [player, setPlayer] = useState(undefined);
    //The device created that the player tries to connect to.
    const [deviceId, setDeviceId] = useState('');
    //Check if there is a player to connect to.
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    //List of tracks returned when searching through tracks.
    const [tracks, setTracks] = useState([]);
    //This will be the data used to create a post.
    const [formData, setFormData] = useState({spotifyID: '', finalTrackName: '', artist: '', description: ''});
    //This will be a list of all the past X amount of DappMyMusicPosts.
    const [allDappMyMusicPosts, setAllDappMyMusicPosts] = useState([]);
    //This will be a list of all the user's posts (posts that they themselves made).
    const [allMyPosts, setAllMyPosts] = useState([]);
    //This will be a list of the user's Top 5 posts.
    const [allMyTop5Posts, setAllMyTop5Posts] = useState([]);
    //This will be the current track being played, and the index from where the user is playing it from.
    const [currentTrack, setCurrentTrack] = useState({playlist: [], index: 0});
    //This will be the current track's song duration (in milliseconds)
    const [trackDuration, setTrackDuration] = useState(0);
    //This will be the position of track playing.
    const [trackPosition, setTrackPosition] = useState(0);
    //This will let us know if the player is currently playing a track.
    const [isPlaying, setIsPlaying] = useState(false);
    
    //Updates the description when the user is making a post.
    const handleChange = (e, name) =>{
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }

    //Updates trakc name and artist name when the user selects a track.
    const handleUpdate = (data, name) =>{
        setFormData((prevState) => ({...prevState, [name]: data}));
    }

    //Updates the progress bar of the track currently playing.
    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newPosition = (clickX / rect.width) * trackDuration;
      
        player.seek(newPosition);
        setTrackPosition(newPosition);
      };

    //Creates a new post after the user submits their post.
    const createNewDappMyMusicPost = async () => {
        try{
            if (!ethereum) return alert("Please install metamask");
            const {spotifyID, finalTrackName, artist, description} = formData;
            const DMMContract = await getEthereumContract();
            const username = await getSpotifyUsername();
            const newPost = await DMMContract.createNewPost(username.display_name, spotifyID, finalTrackName, artist, description);
            window.location.reload();
        } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    //Adds a post to the user's Top 5 list.
    const addToMyTop5 = async (post) => {
        try{
            if (!ethereum) return alert("Please install metamask");
            const alreadyInMyTop5 = allMyTop5Posts.some(myTop5 =>
                myTop5.user == post.user && myTop5.spotifyID == post.spotifyID);
                    
                if(alreadyInMyTop5) return alert("This post has already been added to Top 5");
                
            const DMMContract = await getEthereumContract();
            const addPostToTop5 = await DMMContract.addToMyTop5([
                post.user,
                post.userName,
                post.spotifyID,
                post.songName,
                post.artistName,
                post.description,
                post.creationDate
        ]);
            const response = await addPostToTop5.wait();
            if (response.status === 1){
                console.log("Successfully added to Top 5!");
            } else {
                console.log("Transaction failed: remove from Top 5 or already added to Top 5.");
            }
        } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    //Removes a post from the user's Top 5 list.
    const removeFromMyTop5 = async (index) => {
        try{
            if (!ethereum) return alert("Please install metamask");
            const DMMContract = await getEthereumContract();
            const removePostFromTop5 = await DMMContract.removeFromMyTop5(index);
        } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    //Retrieves the user's Top 5 Posts.
    const getMyTop5 = async () =>{
        try{
            if (!ethereum) return alert("Please install metamask");
            const DMMContract = await getEthereumContract();
            const myTop5 = await DMMContract.getMyTop5();
            const filterMyTop5 = myTop5.filter(post => post.creationDate > 0);
            const structuredPosts = await Promise.all(
                filterMyTop5.map(async (post) => {
                    const trackData = await getTrackIMGURI(post.spotifyID);
                    return {
                        user: post.user, 
                        userName: post.userName,
                        spotifyID: post.spotifyID, 
                        songName: post.songName, 
                        artistName: post.artistName, 
                        description: post.description, 
                        creationDate: post.creationDate,
                        trackIMG: trackData?.trackImg || null,
                        trackURI: trackData?.trackURI || null
                    };
                })
            );

            setAllMyTop5Posts(structuredPosts);
        } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    //Retrives all of the user's posts.
    const getAllMyPosts = async () => {
        try{
            if (!ethereum) return alert("Please install metamask");
            const DMMContract = await getEthereumContract();
            const myPosts = await DMMContract.getAllMyPosts();
            const structuredPosts = await Promise.all(
                myPosts.map(async (post) => {
                    const trackData = await getTrackIMGURI(post.spotifyID);
                    return {
                        user: post.user, 
                        userName: post.userName,
                        spotifyID: post.spotifyID, 
                        songName: post.songName, 
                        artistName: post.artistName, 
                        description: post.description, 
                        creationDate: post.creationDate,
                        trackIMG: trackData?.trackImg || null,
                        trackURI: trackData?.trackURI || null
                    };
                })
            );

            setAllMyPosts(structuredPosts);
        } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    //Gets the track's image and URI by spotifyid.
    const getTrackIMGURI= async (spotifyID) => {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${spotifyID}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
        });
        const songInfo = await response.json();
        const trackImg = songInfo.album.images[0].url;
        const trackURI = songInfo.uri;

        return {trackImg, trackURI};
    }

    //Retrieves the past X amount of posts made by all users
    const getAllDappMyMusicPosts = async () => {
        const provider = new ethers.BrowserProvider(ethereum);
        const DMMContract = new ethers.Contract(contractAddress, contractABI, provider);
        //past X logs from NewPost event
        let dappMyMusicPosts = [];
        //gets the latest block number
        const latestBlock = await provider.getBlockNumber();
        let endBlock = latestBlock;

        //Pulls the last 10 posts or the past ~7 days
        while (dappMyMusicPosts.length < 10 && endBlock > latestBlock - 50000){
            const startBlock = Math.max(endBlock - 4000, 8113257);
            try{
                const events = await DMMContract.queryFilter("NewPost", startBlock, endBlock);
                console.log(`Searching from block ${startBlock} to block ${endBlock}`);
                dappMyMusicPosts = [...events, ...dappMyMusicPosts];
            } catch (err){
                console.error("Error while getting NewPost events: ", err);
            }

            endBlock = startBlock - 1;
        }
        dappMyMusicPosts = dappMyMusicPosts.slice(-50);

        const allPosts = [];
        for (const event of dappMyMusicPosts) {
            const trackInfo = await getTrackIMGURI(event.args.post.spotifyID);
            allPosts.push({
                user: event.args.op, 
                userName: event.args.post.userName,
                spotifyID: event.args.post.spotifyID, 
                songName: event.args.post.songName, 
                artistName: event.args.post.artistName, 
                description: event.args.post.description,
                creationDate: event.args.post.creationDate,
                trackIMG: trackInfo?.trackImg || null,
                trackURI: trackInfo?.trackURI || null
            });
        }
        setAllDappMyMusicPosts(allPosts);
    }

    //Connects user's wallet, when the user tries to connect their MetaMask wallet with the app.
    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
            await getAllMyPosts();
        } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    //When the app loads, checks to see if the their is already a MetaMask wallet connected.
    const checkIfWalletIsConnected = async () => {
        try{
             if (!ethereum) return alert("Please install metamask");

             const accounts = await ethereum.request({method: 'eth_accounts'});
             if(accounts.length){
                 setCurrentAccount(accounts[0]);
                 await getMyTop5();
                 await getAllMyPosts();
             } 
             else {
                 console.log('No accounts found');
             }
        } 
        catch (error){
             console.log(error);
             throw new Error("No ethereum object");
        }
 
     }

    //Using Authorization Code with PKCE Flow, this will authenticate user when they press the connect spotify and then request a token.
    const getACWPKCE = async () =>{
        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        }
          
        const codeVerifier  = generateRandomString(64);
    
        const sha256 = async (plain) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            return window.crypto.subtle.digest('SHA-256', data);
        }
    
        const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
        }
    
        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed);
    
        //const redirectUri = 'http://localhost:5173/';
        const redirectUri = 'https://dappmymusic.vercel.app/';
    
        const scope = 'streaming user-read-private user-read-email user-modify-playback-state';
        const authUrl = new URL("https://accounts.spotify.com/authorize");
    
        // generated in the previous step
        window.localStorage.setItem('code_verifier', codeVerifier);
    
        const params =  {
            response_type: 'code',
            client_id: spotifyClientID,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }
    
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    //After authorization, we must get a token so the user is able to interact with Spotify library
    const getToken = async () =>{
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if(!!code){
            const codeVerifier = localStorage.getItem('code_verifier');
            const url = "https://accounts.spotify.com/api/token";
            //const redirectUri = 'http://localhost:5173/';
            const redirectUri = 'https://dappmymusic.vercel.app/';
            const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: spotifyClientID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
            };
            const body = await fetch(url, payload);
            const response = await body.json();
            localStorage.setItem('token_issued_at', Date.now());
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            window.history.replaceState({}, document.title, "/");
            setIsAuthorized(true);
        }
    }

    //Instead of having the user connect to spotify again, and get authorization, we use the initial access token and refresh it (tokens last one hour)
    const refreshToken = async () => {   
        const refreshToken = localStorage.getItem('refresh_token');
        if(!refreshToken){
            await getToken();
        }
        const url = "https://accounts.spotify.com/api/token";
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: spotifyClientID
            }),
        }
        const body = await fetch(url, payload);
        const response = await body.json();
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
        }
        localStorage.setItem('token_issued_at', Date.now());
    }

    //After getting an access_token, this will schedule a refresh when the access_token expires(2 hours) with the corresponding refresh token.
    const scheduleTokenRefresh = async () => {
        const curRefreshToken = localStorage.getItem('refresh_token');
        if (!curRefreshToken) return; // If there is no refresh token then exit
        const tokenIssuedAt = parseInt(localStorage.getItem('token_issued_at') || "0", 10);
        const expiresIn = 3600 * 1000;
        const now = Date.now();

        if(now - tokenIssuedAt > expiresIn - 5000) {
            await refreshToken();
        }
        if(isAuthorized) {
            const expiresIn = 3600 * 1000; // Spotify tokens last 1 hour
            const issuedAt = parseInt(localStorage.getItem('token_issued_at') || "0", 10);
            const elapsedTime = Date.now() - issuedAt;
            const remainingTime = expiresIn - elapsedTime;

            //console.log(`Token issued at: ${new Date(issuedAt).toISOString()}`);
            //console.log(`Elapsed time: ${elapsedTime / 1000}s`);
            //console.log(`Remaining time: ${remainingTime / 1000}s`);

            // If remaining time is too low, refresh immediately
            const refreshTime = Math.max(remainingTime - 100 * 1000, 5000);
            const time = 10000;
            
            setTimeout(async () => {
                await refreshToken();
                scheduleTokenRefresh(); // Reschedule after refresh
            }, refreshTime);
        }
    }

    const handleSpotifyConnect = () => {
        window.location.href = getACWPKCE();
    }

    //Once the spotify player is created, this will transfer playback to web browser.
    const transferPlayback = async (curDeviceId) => {
        const token = localStorage.getItem('access_token'); //Access token received from auth
        if (player){
            await player.activateElement();
        }
        const response = await fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                device_ids: [curDeviceId],
                play: false,
            }),
        });

        const data = await response;
    }

    //After getting authorization and an access token, this will create a web player.
    const setupSpotifyPlayer = async () => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'DappMyMusicWebPlayer',
                getOAuthToken: cb => { cb(localStorage.getItem('access_token')); },
                volume: 0.5
            });
            setPlayer(player);
            player.addListener('ready', async ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
                setIsPlayerReady(true);
                await transferPlayback(device_id);
                player.addListener('player_state_changed', (state) => {
                    if (!state) return;

                    setTrackDuration(state.duration);
                    setTrackPosition(state.position);
                    setIsPlaying(!state.paused);
                })
            });
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                setIsPlayerReady(false);
            });

            player.addListener("initialization_error", ({ message }) => {
                console.error("Initialization Error:", message);
            });
        
            player.addListener("authentication_error", ({ message }) => {
                console.error("Authentication Error:", message);
            });
        
            player.addListener("account_error", ({ message }) => {
                console.error("Account Error:", message);
            });
        
            player.addListener("playback_error", ({ message }) => {
                console.error("Playback Error:", message);
            });
            player.connect();
        };
    }

    //Updates tracklist when trying to make a post. Only return the first 5 results.
    const getTrackByName = async (trackName) => {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${trackName}&type=track&limit=5`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') },
        });
        const songInfo = await response.json();
        setTracks(songInfo.tracks?.items || []);
    }

    //Clears tracks when the user select a track when making a post.
    const clearTracks = () => {
        setTracks([]);
    }

    //Makes player play the track based off the trackURI passed.
    const setTrackByURI = async (trackURI) => {
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                uris: [trackURI],
                position_ms: 0
            }),
        });
    }

    //Updates the current track, which allows you to play the next track when user skips.
    const setNextTrack = async (playlist, index) => {
        setCurrentTrack({playlist, index});
    }

    //Used to play the next track on the current list.
    const skipToNextTrack = async () => {
        if(!currentTrack.playlist) return alert("Select a track to play");
        if(currentTrack.index == currentTrack.playlist.length - 1){
            await setTrackByURI(currentTrack.playlist[0].trackURI);
            await setNextTrack(currentTrack.playlist, 0);
            return;
        } else if(currentTrack.index < currentTrack.playlist.length - 1){
            await setTrackByURI(currentTrack.playlist[currentTrack.index+1].trackURI);
            await setNextTrack(currentTrack.playlist, currentTrack.index+1);
            return;
        } else{
            return;
        }
    }

    //Used to play previous track on the current list.
    const skipToPreviousTrack = async () => {
        if(!currentTrack.playlist) return alert("Select a track to play");
        if(currentTrack.index == 0){
            await setTrackByURI(currentTrack.playlist[currentTrack.playlist.length-1].trackURI);
            await setNextTrack(currentTrack.playlist, currentTrack.playlist.length-1);
            return;
        } else if(currentTrack.index > 0 && currentTrack.index < currentTrack.playlist.length){
            await setTrackByURI(currentTrack.playlist[currentTrack.index-1].trackURI);
            await setNextTrack(currentTrack.playlist, currentTrack.index-1);
            return;
        } else{
            return;
        }
    }

    //Gets the spotify username to be used as the username when making a post.
    const getSpotifyUsername = async () => {
        const response = await fetch(`https://api.spotify.com/v1/me`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}`}
        });
        return await response.json();
    }
    

    //Initializes the application
    useEffect(() => {
        const initialize = async () =>{
            await getToken();
            await scheduleTokenRefresh();
            await setupSpotifyPlayer();
            await checkIfWalletIsConnected();
            await getAllDappMyMusicPosts();  
        }
        initialize();
    }, []);

    //While a track is playing, the player will update accordingly.
    useEffect(() => {
        let interval = null;
        if (isPlaying) {
            interval = setInterval(() => {
            player.getCurrentState().then(state =>{
                setTrackPosition(state.position);
            });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);
    
    return (
        <DappMyMusicContext.Provider value={{connectWallet, currentAccount, player, transferPlayback, getTrackByName, tracks, clearTracks, setTrackByURI,
                                            formData, handleChange, handleUpdate, createNewDappMyMusicPost, getAllDappMyMusicPosts, allDappMyMusicPosts, 
                                            allMyPosts, addToMyTop5, removeFromMyTop5, allMyTop5Posts, setNextTrack, skipToNextTrack, skipToPreviousTrack, 
                                            handleSeek, trackPosition, trackDuration, currentTrack, isPlaying}}>
            {!isAuthorized ? (
            <div className="flex w-full justify-center items-center">
                <button type="button" onClick={handleSpotifyConnect} className="bg-green-500">
                    Connect Spotify
                </button>
            </div>
            ) : (
                children
            )}
        </DappMyMusicContext.Provider>
    );
}
