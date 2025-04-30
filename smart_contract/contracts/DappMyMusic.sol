// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract DappMyMusic{


    /*A post will have the address of the OP (original poster), the username of the OP, the name of 
    the song the post is about, the artist's name, a description about the song, and a date when the 
    post was created.*/
    struct DMMPost{
        address user;
        string userName;
        string songName;
        string artistName;
        string description;
        uint256 creationDate;
    }

    //logs whenever user makes a new post. This can be used to list out all posts made by all users.
    event NewPost(address indexed op, string indexed songName, DMMPost post);

    DMMPost[5] internal myTop5;
    DMMPost[] internal myPosts;


    //Will be used anytime a new post is made.
    function logPost(DMMPost memory post) internal{
        emit NewPost(msg.sender, post.songName, post);
    }

    //Creates new post
    function createNewPost(string calldata userName, string calldata songName, string calldata artistName, string calldata description) external{
        DMMPost memory newPost = DMMPost(msg.sender, userName, songName, artistName, description, block.timestamp);
        myPosts.push(newPost);
        logPost(newPost);
    }
    //Add new post/song to users top 5.
    function addToMyTop5(DMMPost calldata post) external returns(bool){
        for (uint i=0; i<5; i++){
            if(myTop5[i].user != msg.sender){
                myTop5[i]=post;
                return true;
            }
        }
        return false;
    }

    //removes a chosen post from user's top 5
    function removeFromMyTop5(uint256 index) external{
        if (index >= 5) return;

        for (uint i = index; i < 4; i++){
            myTop5[i] = myTop5[i+1];
        }
        delete myTop5[4];
    }

    //Returns all users posts
    function getAllMyPosts() external view returns(DMMPost[] memory){
        return myPosts;
    }

    //Returns user's Top5 posts
    function getMyTop5() external view returns(DMMPost[5] memory){
        return myTop5;
    }
}


