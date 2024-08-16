import React from 'react';
import { useCart } from 'react-use-cart';

const ItemCard = ({ item, typePieceMap }) => {
  const { addItem } = useCart();

  // Ensure the item has an id
  if (!item._id) {
    console.error('Item is missing an id:', item);
    return null;
  }

  // Define the item object to be added to the cart
  const cartItem = {
    id: item._id,
    name: item.name,
    price: item.price,
    // Add other properties as needed
    image: item.image.Location, // If image is needed in cart
    quantity: 1 // Default quantity or add logic for user input
  };

  return (
    <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <a href="#" className="flex flex-col " style={{ height: "100%", display: "flex", flexDirection: "column" ,textDecoration: 'none' }}>
        <img
          className="object-cover w-full rounded-t-lg h-48 md:h-32"
          src={item.image.Location}
          alt={item.title}
        />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Nom : {item.name}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Réference : {item.reference}
          </p>
          <p className={`mb-3 font-normal ${
              item.state === 'Neuf'
                ? 'text-green-700 dark:text-green-400'
                : item.state === 'Utilisé'
                ? 'text-red-700 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-400'
            }`}
          >
            Etat : {item.state}
          </p>
          <p className="mb-3 font-normal text-orange-400 dark:text-gray-400">
            Price : €{item.price}
          </p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Type : {typePieceMap[item.typePiece] || 'Unknown'}
          </p>

          {/* Add to Cart Button */}
          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => addItem(cartItem)}
              className="w-full bg-custom-blue text-white p-2 rounded-md hover:bg-custom-purple hover:text-green-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ItemCard;
