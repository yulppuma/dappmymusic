// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract DMM{


    /*A post will have the address of the OP (original poster), the username of the OP(from their spotify),
    the unique spotify id(used to differentiate songs),the name of the song the post is about, the artist's 
    name, a description about the song and a date when the post was created.*/
    struct DMMPost{
        address user;
        string userName;
        string spotifyID;
        string songName;
        string artistName;
        string description;
        uint256 creationDate;
    }

    //logs whenever user makes a new post. This can be used to list out all posts made by all users.
    event NewPost(address indexed op, string indexed songName, DMMPost post);

    mapping (address => DMMPost[]) internal myPosts;
    mapping (address => DMMPost[5]) internal myTop5;


    //Will be used anytime a new post is made.
    function logPost(DMMPost memory post) internal{
        emit NewPost(msg.sender, post.songName, post);
    }

    //Creates a new post.
    function createNewPost(string calldata userName, string calldata spotifyID, string calldata songName, string calldata artistName, string calldata description) external{
        DMMPost memory newPost;
        newPost.user = msg.sender;
        newPost.userName = userName;
        newPost.spotifyID = spotifyID;
        newPost.songName = songName;
        newPost.artistName = artistName;
        newPost.description = description;
        newPost.creationDate = block.timestamp;
        myPosts[msg.sender].push(newPost);
        logPost(newPost);
    }
    //Add new post/song to users top 5.
    function addToMyTop5(DMMPost calldata post) external returns(bool){
        for (uint i=0; i<5; i++){
            if (myTop5[msg.sender][i].user == post.user &&  
                keccak256(abi.encodePacked(myTop5[msg.sender][i].spotifyID)) == keccak256(abi.encodePacked(post.spotifyID))){
                    return false; //Already added this post to Top5
            }

            if (myTop5[msg.sender][i].creationDate == 0){
                myTop5[msg.sender][i] = post;
                return true;
            }
        }
        return false; //Already have 5 songs in Top5.
    }

    //removes a chosen post from user's top 5
    function removeFromMyTop5(uint256 index) external{
        if (index >= 5) return;

        for (uint i = index; i < 4; i++){
            myTop5[msg.sender][i] = myTop5[msg.sender][i+1];
        }
        delete myTop5[msg.sender][4];
    }

    //Returns all users posts
    function getAllMyPosts() external view returns(DMMPost[] memory){
        return myPosts[msg.sender];
    }

    //Returns user's Top5 posts
    function getMyTop5() external view returns(DMMPost[5] memory){
        return myTop5[msg.sender];
    }
}


