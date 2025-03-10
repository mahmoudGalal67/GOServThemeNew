import React, { useContext } from "react";
import FavButton from "../FavButton/FavButton";
import CartButton from "../CartButton/CartButton";

import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../pages/Redux/CartSlice";
import { addFavorite, removeFavorite } from "../../pages/Redux/FavoriteSlice";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { request } from "../utils/Request";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

function Product({ product, brand, category, layout }) {
  let [searchParams, setSearchParams] = useSearchParams();

  const { user } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["user"]);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const favoriteItems = useSelector((state) => state.favorites.items);

  const truncateTitle = (title, numWords) => {
    const words = title.split(" ");
    if (words.length > numWords) {
      return words.slice(0, numWords).join(" ") + "...";
    }
    return title;
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.info("you have to login firist");
      return;
    }
    try {
      const productData = {
        product_id: product.product_id,
        product_name: product.product_name_ar,
        price: product.price,
        admin_id: searchParams.get("id"),
        photoes: product.photoes,
        quantity: 1,
      };
      const { data } = await request({
        url: `/api/Clients/add_orders?uid=${
          user.userId
        }&admin_id=${searchParams.get("id")}`,
        method: "POST",
        data: productData,

        headers: { Authorization: `Bearer ${cookies?.usertoken}` },
      });
      dispatch(addItemToCart(productData));
    } catch (err) {
      console.log(err);
    }
  };

  const handleFavoriteClick = (product) => {
    if (isProductFavorite(product.product_id)) {
      dispatch(removeFavorite(product.product_id));
    } else {
      dispatch(addFavorite(product));
    }
  };

  const isProductInCart = (productId) => {
    return cartItems?.some((item) => item.product_id === productId);
  };

  const isProductFavorite = (productId) => {
    return favoriteItems.some((item) => item.product_id === productId);
  };

  return (
    <div
      key={product.product_id}
      className={layout === "column" ? "product column" : "product"}
      style={{
        padding: "12px",
        justifyContent: layout ? "space-around" : "",
      }}
    >
      <img
        src={`https://salla1111-001-site1.ptempurl.com/${product.photoes[0]}`}
        alt=""
        style={{
          width: "100%",
          height: "50%",
          margin: "0",
        }}
      />
      <div className="title">{brand.brand_name}</div>
      <Link
        to={`/productDetails/${product.product_id}?id=${searchParams.get(
          "id"
        )}`}
      >
        <p className="desc">{truncateTitle(product.product_name_ar, 2)}</p>
      </Link>
      <p className="info">{category.category_name_ar}</p>
      <div className="price-wrapper">
        <div className="old">{product.price * 1.4} ر.س</div>
        <div className="new">{product.price} رس</div>
      </div>
      <div className="links-container d-flex justify-content-around w-100">
        <div
          onClick={(e) => {
            e.preventDefault();
            handleFavoriteClick(product);
          }}
        >
          <FavButton active={isProductFavorite(product.product_id)} />
        </div>
        <div onClick={() => handleAddToCart(product)}>
          <CartButton active={isProductInCart(product.product_id)} />
        </div>
      </div>
      <div className="offer">خصم 25%</div>
      <div className="special">جديد</div>
    </div>
  );
}

export default Product;
