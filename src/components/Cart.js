import {
  DeleteOutlined,
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useCart } from "react-use-cart";
import "./Cart.css";
const Cart = () => {
  const {
    isEmpty,
    items,
    removeItem,
    updateItemQuantity,
    totalItems,
    cartTotal,
  } = useCart();
  console.log(items)
  // Set isCartOpen to true if the cart is not empty, otherwise false
  const [isCartOpen, setIsCartOpen] = useState(!isEmpty);
  const [openItems, setOpenItems] = useState({}); // État pour gérer chaque accordéon d'item

  useEffect(() => {
    setIsCartOpen(!isEmpty); // Update the state if the cart becomes empty or non-empty
  }, [isEmpty]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleItem = (id) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  if (isEmpty) return <h5>Your cart is empty</h5>;

  return (
    <div className="cart">
      <button
        onClick={toggleCart}
        style={{
          backgroundColor: "gray",
          padding: "10px",
          border: "none",
          color: "white",
          width: "100%",
        }}
      >
        {isCartOpen ? (
          <>
            Hide cart <MinusOutlined />
          </>
        ) : (
          <>
            Show cart <PlusOutlined />
          </>
        )}
      </button>

      {isCartOpen && (
        <div style={{ marginTop: "10px" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <h3 style={{ marginBottom: "20%" }}>
              Votre panier <ShoppingCartOutlined />
            </h3>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: "25px" }} className="cartitems">
                <div
                  style={{
                    display: "flex",
                    width:"100%"
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "15px",
                      marginRight:"10px"
                    }}
                  />
                  <button
                    onClick={() => toggleItem(item.id)}
                    style={{ padding: "3px", border: "none", width: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        fontSize: "20px",
                      }}
                    >
                      <h6>{item.name}</h6> <DownOutlined style={{marginLeft:"auto"}}/>
                    </div>
                    
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                 <div style={{marginRight:"50%",fontSize:"25px"}} > X {item.quantity} </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="cartButtons"
                  >
                    <DeleteOutlined />
                  </button>
                  <button
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity + 1)
                    }
                    className="cartButtonsRed"
                  >
                    <PlusOutlined />
                  </button>
                  <button
                    onClick={() =>
                      updateItemQuantity(item.id, item.quantity - 1)
                    }
                  >
                    <MinusOutlined />
                  </button>
                </div>
                {openItems[item.id] && (
                  <div style={{ paddingLeft: "20px", marginTop: "5px" }}>
                    <div>
                      <h6>{item.name}</h6>
                      <p>Price: €{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <h6>Total Items: {totalItems}</h6>
          <h6>Total Price: €{cartTotal}</h6>
        </div>
      )}
    </div>
  );
};

export default Cart;
