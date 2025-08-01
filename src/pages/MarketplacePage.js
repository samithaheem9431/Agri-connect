import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const items = [];
    querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      title,
      price,
      createdAt: new Date(),
    });
    setTitle("");
    setPrice("");
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Sell Your Product</h2>
      <form onSubmit={addProduct}>
        <input placeholder="Product Name" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <h3>Market Listings</h3>
      <ul>
        {products.map((item) => (
          <li key={item.id}>{item.title} - Rs. {item.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default MarketplacePage;
