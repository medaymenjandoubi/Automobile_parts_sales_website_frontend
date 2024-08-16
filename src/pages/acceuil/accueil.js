import React, { useEffect, useState, useContext } from "react";
import SideBar from "../../components/SideBar.js";
import { Context } from "../../context/index.js";
import SearchBar from "../../components/SearchBar.js";
import MovingImage from "../../components/MovingImage.js";
import { getAllPiece } from "../../service/Piece.js";
import { getAllTypePiece } from "../../service/TypePiece.js";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ItemCard from "../../components/ItemCard.js"; // Import ItemCard


export default function Accueil() {
  const [hidden, setHidden] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const {
    state: { user },
  } = useContext(Context);
  const [piece, setPiece] = useState([]);
  const [search, setSearch] = useState("");
  const [typePiece, setTypePiece] = useState([]);
   const [isCollapsed, setIsCollapsed] = useState(false); // State to manage the collapse/expand

  // States for filters, categories, and sorting
  const [selectedState, setSelectedState] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  // State for price range filter
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(4000);

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const PieceResponse = await getAllPiece();
        const typePieceResponse = await getAllTypePiece();
        setTypePiece(typePieceResponse.data);
        setPiece(PieceResponse.data);
        setHidden(false);
         const maxPiecePrice = Math.max(...PieceResponse.data.map(item => item.price));
         setMaxPrice(maxPiecePrice);
      } catch (error) {
        console.log(error);
        setHidden(true);
      }
    };
    fetchPieces();
  }, []);

  const typePieceMap = typePiece.reduce((acc, type) => {
    acc[type._id] = type.name;
    return acc;
  }, {});

 

  // Filtering and sorting logic
  const filteredAndSortedPieces = piece
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.reference.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => (selectedState ? item.state === selectedState : true))
    .filter((item) =>
      selectedCategory ? item.typePiece === selectedCategory : true
    )
    .filter((item) => item.price >= minPrice && item.price <= maxPrice)
    .sort((a, b) => {
      if (sortOption === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortOption === "price-asc") {
        return a.price - b.price;
      } else if (sortOption === "price-desc") {
        return b.price - a.price;
      }
      return 0;
    });
    const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed); // Toggle the sidebar state
    };

  return (
    
    <div className="flex" style={{width:"100%"}}>
      
      <button
        onClick={toggleSidebar}
        className="bg-blue-500 text-white "
        style={{ height: "50px" }}
      >
        
      </button>
      
      
      <div style={{ width: !isCollapsed ? "30%" : "5%" }}>
        <SideBar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          toggleSidebar={toggleSidebar}
        />
      </div>
      
      
      <div style={{ width: !isCollapsed ? "100%" : "100%", position: "relative" }}>
        <div style={{ height: "15vh" }}>
          <MovingImage />
        </div>

        <div style={{ marginTop: "50px" }}>
          <SearchBar setSearch={setSearch} search={search} />
        </div>

        {/* Filters and Sorting UI */}
        <div className="flex gap-4 mt-4" style={{backgroundColor:"orange"}}>
          <select
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-2  ml-2 custom-select"
          >
            <option value="">All States</option>
            <option value="Neuf">Neuf</option>
            <option value="Utilisé">Utilisé</option>
          </select>

          <style jsx>{`
  .custom-select {
    background-color: orange; /* Background color */
    color: black; /* Text color */
    font-size: 16px; /* Font size */
    font-family: Arial, sans-serif; /* Font family */
    border-radius: 8px; /* Border radius */
    border: 1px solid rgba(0, 0, 0, 0.2); /* Border style */
    padding: 8px; /* Padding inside the select */
    transition: background-color 0.3s ease, border-color 0.3s ease; /* Smooth transition */
  }

  .custom-select:focus {
    outline: none; /* Remove default outline */
    border-color: darkorange; /* Change border color on focus */
    background-color: #ffcc99; /* Light orange background on focus */
  }
`}</style>

          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 ml-2 custom-select"
          >
            <option value="">All Categories</option>
            {typePiece.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2  ml-2 custom-select"
          >
            <option value="name-asc">Sort by Name: A-Z</option>
            <option value="name-desc">Sort by Name: Z-A</option>
            <option value="price-asc">Sort by Price: Low to High</option>
            <option value="price-desc">Sort by Price: High to Low</option>
          </select>
          <div
    className="flex items-center gap-4  ml-3 text-white"
    style={{
      width: "50%",
      paddingLeft: "5%",
    }}
  >
    <label>Min Price: €{minPrice}</label>
    <input
      type="range"
      min="0"
      max="1000"
      value={minPrice}
      onChange={(e) => setMinPrice(parseInt(e.target.value))}
      className="slider"
    />
    <label>Max Price: €{maxPrice}</label>
    <input
      type="range"
      min="0"
      max="1000"
      value={maxPrice}
      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
      className="slider"
    />
  </div>
        </div>

        {/* Price Range Slider */}
        {/* Price Range Slider */}

        {/* Render filtered and sorted items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {filteredAndSortedPieces.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              typePieceMap={typePieceMap}
              setMaxPrice={setMaxPrice}
            />
          ))}
        </div>
      </div>
    </div>
    
  );
}
