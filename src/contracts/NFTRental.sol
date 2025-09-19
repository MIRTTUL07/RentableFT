// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTRental
 * @dev Smart contract for renting NFTs
 */
contract NFTRental is ReentrancyGuard, Ownable {
    struct RentalListing {
        address owner;
        address renter;
        address nftContract;
        uint256 tokenId;
        uint256 dailyRate;
        uint256 collateral;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }

    struct SaleListing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool isActive;
    }
    
    mapping(bytes32 => RentalListing) public rentals;
    mapping(bytes32 => SaleListing) public sales;
    mapping(address => mapping(uint256 => bytes32)) public nftToRental;
    mapping(address => mapping(uint256 => bytes32)) public nftToSale;
    
    event NFTListedForRent(
        bytes32 indexed rentalId,
        address indexed owner,
        address indexed nftContract,
        uint256 tokenId,
        uint256 dailyRate,
        uint256 collateral
    );
    
    event NFTRented(
        bytes32 indexed rentalId,
        address indexed renter,
        uint256 startTime,
        uint256 endTime,
        uint256 totalCost
    );
    
    event RentalEnded(
        bytes32 indexed rentalId,
        address indexed renter,
        uint256 endTime
    );

    event NFTListedForSale(
        bytes32 indexed saleId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event NFTPurchased(
        bytes32 indexed saleId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );
    
    /**
     * @dev List an NFT for rent
     */
    function listForRent(
        address nftContract,
        uint256 tokenId,
        uint256 dailyRate,
        uint256 collateral
    ) external nonReentrant {
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not token owner");
        require(dailyRate > 0, "Daily rate must be greater than 0");
        require(collateral > 0, "Collateral must be greater than 0");
        
        bytes32 rentalId = keccak256(abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp));
        
        rentals[rentalId] = RentalListing({
            owner: msg.sender,
            renter: address(0),
            nftContract: nftContract,
            tokenId: tokenId,
            dailyRate: dailyRate,
            collateral: collateral,
            startTime: 0,
            endTime: 0,
            isActive: true
        });
        
        nftToRental[nftContract][tokenId] = rentalId;
        
        emit NFTListedForRent(rentalId, msg.sender, nftContract, tokenId, dailyRate, collateral);
    }
    
    /**
     * @dev Rent an NFT
     */
    function rentNFT(bytes32 rentalId, uint256 rentalDays) external payable nonReentrant {
        RentalListing storage rental = rentals[rentalId];
        require(rental.isActive, "Rental not active");
        require(rental.renter == address(0), "Already rented");
        require(rentalDays > 0, "Rental days must be greater than 0");
        
        uint256 totalCost = rental.dailyRate * rentalDays + rental.collateral;
        require(msg.value >= totalCost, "Insufficient payment");
        
        rental.renter = msg.sender;
        rental.startTime = block.timestamp;
        rental.endTime = block.timestamp + (rentalDays * 1 days);
        
        // Transfer the NFT to this contract as escrow
        IERC721(rental.nftContract).transferFrom(rental.owner, address(this), rental.tokenId);
        
        // Pay the owner (minus collateral which is held in escrow)
        payable(rental.owner).transfer(rental.dailyRate * rentalDays);
        
        emit NFTRented(rentalId, msg.sender, rental.startTime, rental.endTime, totalCost);
    }
    
    /**
     * @dev End rental and return NFT
     */
    function endRental(bytes32 rentalId) external nonReentrant {
        RentalListing storage rental = rentals[rentalId];
        require(rental.renter == msg.sender || rental.owner == msg.sender || block.timestamp > rental.endTime, "Unauthorized");
        require(rental.renter != address(0), "Not rented");
        
        // Return NFT to owner
        IERC721(rental.nftContract).transferFrom(address(this), rental.owner, rental.tokenId);
        
        // Return collateral to renter
        payable(rental.renter).transfer(rental.collateral);
        
        emit RentalEnded(rentalId, rental.renter, block.timestamp);
        
        // Reset rental
        rental.renter = address(0);
        rental.startTime = 0;
        rental.endTime = 0;
    }
    
    /**
     * @dev Cancel rental listing
     */
    function cancelListing(bytes32 rentalId) external {
        RentalListing storage rental = rentals[rentalId];
        require(rental.owner == msg.sender, "Not owner");
        require(rental.renter == address(0), "Cannot cancel active rental");
        
        rental.isActive = false;
        delete nftToRental[rental.nftContract][rental.tokenId];
    }
    
    /**
     * @dev Get rental info
     */
    function getRental(bytes32 rentalId) external view returns (RentalListing memory) {
        return rentals[rentalId];
    }
    
    /**
     * @dev List an NFT for sale
     */
    function listForSale(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be greater than 0");
        
        bytes32 saleId = keccak256(abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp, "sale"));
        
        sales[saleId] = SaleListing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            isActive: true
        });
        
        nftToSale[nftContract][tokenId] = saleId;
        
        emit NFTListedForSale(saleId, msg.sender, nftContract, tokenId, price);
    }

    /**
     * @dev Buy an NFT
     */
    function buyNFT(bytes32 saleId) external payable nonReentrant {
        SaleListing storage sale = sales[saleId];
        require(sale.isActive, "Sale not active");
        require(msg.value >= sale.price, "Insufficient payment");
        require(msg.sender != sale.seller, "Cannot buy your own NFT");
        
        // Transfer NFT to buyer
        IERC721(sale.nftContract).transferFrom(sale.seller, msg.sender, sale.tokenId);
        
        // Pay seller
        payable(sale.seller).transfer(sale.price);
        
        // Return excess payment
        if (msg.value > sale.price) {
            payable(msg.sender).transfer(msg.value - sale.price);
        }
        
        emit NFTPurchased(saleId, msg.sender, sale.seller, sale.price);
        
        // Deactivate sale
        sale.isActive = false;
        delete nftToSale[sale.nftContract][sale.tokenId];
    }

    /**
     * @dev Cancel sale listing
     */
    function cancelSale(bytes32 saleId) external {
        SaleListing storage sale = sales[saleId];
        require(sale.seller == msg.sender, "Not seller");
        require(sale.isActive, "Sale not active");
        
        sale.isActive = false;
        delete nftToSale[sale.nftContract][sale.tokenId];
    }

    /**
     * @dev Get sale info
     */
    function getSale(bytes32 saleId) external view returns (SaleListing memory) {
        return sales[saleId];
    }

    /**
     * @dev Check if NFT is available for rent
     */
    function isAvailableForRent(address nftContract, uint256 tokenId) external view returns (bool) {
        bytes32 rentalId = nftToRental[nftContract][tokenId];
        if (rentalId == bytes32(0)) return false;
        
        RentalListing memory rental = rentals[rentalId];
        return rental.isActive && rental.renter == address(0);
    }

    /**
     * @dev Check if NFT is available for sale
     */
    function isAvailableForSale(address nftContract, uint256 tokenId) external view returns (bool) {
        bytes32 saleId = nftToSale[nftContract][tokenId];
        if (saleId == bytes32(0)) return false;
        
        SaleListing memory sale = sales[saleId];
        return sale.isActive;
    }
}