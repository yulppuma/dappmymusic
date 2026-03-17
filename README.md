# DappMyMusic

DappMyMusic is a decentralized music blogging platform that allows users to publish music-related posts tied to specific tracks while interacting with Ethereum smart contracts.

The application integrates the Spotify API with a blockchain backend, allowing users to associate posts with real songs while maintaining decentralized identity and on-chain interaction.

🔗 Live Demo  
https://dappmymusic.vercel.app/

---

# Overview

DappMyMusic was my **first full-stack Web3 project**, built to explore how blockchain applications can integrate with existing Web2 ecosystems.

The goal of the project was to create a decentralized platform where users could discuss music and publish posts linked to real songs while interacting with Ethereum smart contracts.

The platform combines:

• A **React-based frontend**  
• **Spotify API integration** for song discovery  
• **Ethereum smart contracts** for decentralized interactions  
• **Wallet-based authentication** using MetaMask  

This project introduced core Web3 development concepts such as wallet connectivity, smart contract deployment, and on-chain transaction flows.

---

# Engineering Note

This project was developed **before I had formal smart contract security training** and prior to completing an advanced Solidity bootcamp.

As a result, some modern best practices such as:

- Gas optimization
- Security patterns
- Contract modularity
- Upgradeable architecture

were not yet applied at the time.

The project remains an important milestone in my development because it represents the foundation that led to later projects involving:

- Chainlink oracle systems
- automation infrastructure
- staking contracts
- advanced smart contract design patterns

---

# Key Features

## Music-Based Posting

Users can create posts tied to specific songs using the Spotify API.

Each post contains:

- Song title
- Artist
- Album artwork
- User message
- Associated wallet address

---

## Wallet-Based Authentication

The platform uses **MetaMask wallet authentication** instead of traditional login systems.

Users interact with the application through their Ethereum wallet, enabling:

- decentralized identity
- on-chain interactions
- blockchain-backed actions

---

## Spotify API Integration

The Spotify API is used to:

- Search songs
- Retrieve song metadata
- Display album artwork
- Associate posts with real music tracks

This bridges traditional music platforms with decentralized applications.

---

# Architecture

The application consists of three primary layers:

```
Frontend (React + Vite)
        ↓
Web3 Interface (Ethers.js)
        ↓
Smart Contracts (Solidity on Sepolia Testnet)
        ↓
Spotify Web API
```

---

# Smart Contract Responsibilities

The smart contract layer manages blockchain interactions for the application.

Responsibilities include:

- Recording user posts on-chain
- Associating wallet addresses with posts
- Storing metadata related to music discussions
- Emitting events used by the frontend

---

# Tech Stack

## Blockchain

- Solidity
- Ethereum (Sepolia Testnet)
- Ethers.js
- MetaMask

---

## Frontend

- React
- Vite
- TailwindCSS

---

## External APIs

- Spotify Web API
- OAuth PKCE Authentication

---

## Development Tools

- Hardhat
- Git
- VS Code

---

# Project Structure

```
dappmymusic

client
 └─ React frontend application

contracts
 ├─ Solidity smart contracts
 ├─ deployment scripts
 └─ tests

README.md
```

---

# Local Development Setup

## Prerequisites

Ensure the following tools are installed:

- Node.js (v16+ recommended)
- npm
- Git
- MetaMask
- VS Code
- Hardhat

---

# Installation

Clone the repository:

```bash
git clone https://github.com/yulppuma/dappmymusic.git
```

Navigate into the project directory:

```bash
cd dappmymusic
```

---

# Install Dependencies

Install dependencies in both directories.

Frontend:

```bash
cd client
npm install
```

Smart Contracts:

```bash
cd ../contracts
npm install
```

---

# Compile Smart Contracts

```bash
npx hardhat compile
```

---

# Run Tests

```bash
npx hardhat test
```

---

# Start the Frontend

From the client directory:

```bash
npm run dev
```

Open the local development URL displayed in the terminal.

---

# Future Improvements

Potential improvements for the platform include:

## Tokenized Music Reviews

Implement ERC-20 or ERC-721 tokens representing:

- music reviews
- community participation
- on-chain reputation

---

## NFT-Based Content

Users could mint music reviews or playlists as NFTs, enabling:

- collectible music commentary
- creator ownership of content
- decentralized publishing

---

## On-Chain Comment System

Replace off-chain discussions with an **on-chain comment system**, allowing users to interact with posts through smart contract transactions.

---

## Gas Optimization & Security Enhancements

Modern improvements could include:

- optimized storage structures
- access control patterns
- contract modularization
- gas-efficient event indexing
