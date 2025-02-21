import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { request } from "../utils/Request";

import "swiper/css";
import "swiper/css/navigation";

import "./DynamicProducts.css";
import CartButton from "../CartButton/CartButton";
import FavButton from "../FavButton/FavButton";
import { Link, useSearchParams } from "react-router-dom";
import Product from "../Product/Product";

function DynamicProducts({ id }) {
  let [searchParams, setSearchParams] = useSearchParams();

  const [DynamicProducts, setDynamicProducts] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await request({
          url: `/api/Product_details/Getallfilter?catid=${id}`,
        });
        setDynamicProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (DynamicProducts.length == 0) {
    return (
      <div style={{ padding: "45px", fontSize: "22px", textAlign: "center" }}>
        {" "}
        <span>No Products Found</span>
      </div>
    );
  }

  if (err || !DynamicProducts) {
    return <span className="error">{err}</span>;
  }
  return (
    <section className="dynamic-products">
      <div className="header d-flex justify-content-around">
        <Link to={`/products?id=${searchParams.get("id")}`}>
          <button className="custom-link-ouline  btn btn-3 hover-border-3">
            <img src="arrow.svg" alt="" />
            <span> عرض الكل</span>
          </button>
        </Link>
        <div>
          <h2>{DynamicProducts[0].category_name_ar}</h2>
          <p> {DynamicProducts[0].details_ar} </p>
        </div>
      </div>
      <Swiper
        breakpoints={{
          768: {
            slidesPerView: 1,
          },
          1080: {
            slidesPerView: 3,
          },
          1400: {
            slidesPerView: 5,
          },
        }}
        spaceBetween={0}
        navigation
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Navigation]}
      >
        {DynamicProducts[0].brandsDto.map((brand) => (
          <>
            <span>{brand.brand_name}</span>
            {brand?.productDto.map((product) => (
              <SwiperSlide className="flex" key={product.product_id}>
                <Product
                  product={product}
                  brand={brand}
                  category={DynamicProducts[0]}
                />
                {/* <div className="product">
                  <img
                    src={`https://salla1111-001-site1.ptempurl.com/${product.photoes[0]}`}
                    alt=""
                  />
                  <div className="title">{product.product_name_ar}</div>
                  <p className="desc">{product.description_ar}</p>
                  <p className="info">
                    {product?.productDetailDto[0].details_ar}{" "}
                  </p>
                  <div className="price-wrapper">
                    <div className="old">{product.price}</div>
                    <div className="new">{product.price * 0.8}</div>
                  </div>
                  <div className="links-wrapper">
                    <FavButton />
                    <CartButton />
                  </div>
                  <div className="offer">خصم 25%</div>
                  <div className="special">جديد</div>
                </div> */}
              </SwiperSlide>
            ))}
          </>
        ))}
      </Swiper>
    </section>
  );
}

export default DynamicProducts;
