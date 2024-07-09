import React from "react";
import styles from "./styles.module.css";

const Header: React.FC = () => {
  return (
    <header>
      <div id="header-sticky" className="header__area grey-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4">
              <div className="logo">
                <a href="/">
                  <img
                    alt="logo"
                    fetchPriority="high"
                    width="140"
                    height="23"
                    decoding="async"
                    data-nimg="1"
                    style={{ color: "transparent" }}
                    src="/images/logo/brand-dark.png"
                  />
                </a>
              </div>
            </div>
            <div className="col-xl-9 col-lg-9 col-md-8 col-sm-8">
              <div className="header__right p-relative d-flex justify-content-between align-items-center">
                <div className="main-menu d-none d-lg-block">
                  <nav>
                    <ul>
                      <li className="active has-dropdown">
                        <a href="/">Home</a>
                        <ul className="submenu transition-3">
                          <li>
                            <a href="/">Home Style 1</a>
                          </li>
                          <li>
                            <a href="/home-2">Home Style 2</a>
                          </li>
                          <li>
                            <a href="/home-3">Home Style 3</a>
                          </li>
                          <li>
                            <a href="/home-4">Home Style 4</a>
                          </li>
                          <li>
                            <a href="/home-5">Home Style 5</a>
                          </li>
                          <li>
                            <a href="/home-6">Home Style 6</a>
                          </li>
                          <li>
                            <a href="/home-7">Home Style 7</a>
                          </li>
                        </ul>
                      </li>
                      <li className="mega-menu has-dropdown">
                        <a href="/shop">Shop</a>
                        <ul
                          className="submenu transition-3"
                          style={{
                            background: "url(/assets/img/bg/mega-menu-bg.jpg)",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center right",
                            backgroundSize: "cover",
                          }}
                        >
                          <li className="has-dropdown">
                            <a href="/shop">Shop Pages</a>
                            <ul>
                              <li>
                                <a href="/shop">Standard Shop Page</a>
                              </li>
                              <li>
                                <a href="/shop-right">Shop Right Sidebar</a>
                              </li>
                              <li>
                                <a href="/shop-4-col">Shop 4 Column</a>
                              </li>
                              <li>
                                <a href="/shop-3-col">Shop 3 Column</a>
                              </li>
                              <li>
                                <a href="/shop">Shop Page</a>
                              </li>
                              <li>
                                <a href="/shop">Shop Page</a>
                              </li>
                              <li>
                                <a href="/shop">Shop Infinity</a>
                              </li>
                            </ul>
                          </li>
                          <li className="has-dropdown">
                            <a href="/shop">Products Pages</a>
                            <ul>
                              <li>
                                <a href="/product-details">Product Details</a>
                              </li>
                              <li>
                                <a href="/product-details">Product Page V2</a>
                              </li>
                              <li>
                                <a href="/product-details">Product Page V3</a>
                              </li>
                              <li>
                                <a href="/product-details">Product Page V4</a>
                              </li>
                              <li>
                                <a href="/product-details">Simple Product</a>
                              </li>
                              <li>
                                <a href="/product-details">Variable Product</a>
                              </li>
                              <li>
                                <a href="/product-details">External Product</a>
                              </li>
                            </ul>
                          </li>
                          <li className="has-dropdown">
                            <a href="/shop">Other Shop Pages</a>
                            <ul>
                              <li>
                                <a href="/wishlist">Wishlist</a>
                              </li>
                              <li>
                                <a href="/compare">Compare</a>
                              </li>
                              <li>
                                <a href="/cart">Shopping Cart</a>
                              </li>
                              <li>
                                <a href="/checkout">Checkout</a>
                              </li>
                              <li>
                                <a href="/register">Register</a>
                              </li>
                              <li>
                                <a href="/login">Login</a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li className="active has-dropdown">
                        <a href="/blog">Blog</a>
                        <ul className="submenu transition-3">
                          <li>
                            <a href="/blog">Blog</a>
                          </li>
                          <li>
                            <a href="/blog-left-sidebar">Blog Left Sidebar</a>
                          </li>
                          <li>
                            <a href="/blog-no-sidebar">Blog No Sidebar</a>
                          </li>
                          <li>
                            <a href="/blog-2-col">Blog 2 Column</a>
                          </li>
                          <li>
                            <a href="/blog-2-col-mas">Blog 2 Col Masonry</a>
                          </li>
                          <li>
                            <a href="/blog-3-col">Blog 3 Column</a>
                          </li>
                          <li>
                            <a href="/blog-details">Blog Details</a>
                          </li>
                        </ul>
                      </li>
                      <li className="active has-dropdown">
                        <a href="/shop">Pages</a>
                        <ul className="submenu transition-3">
                          <li>
                            <a href="/wishlist">Wishlist</a>
                          </li>
                          <li>
                            <a href="/cart">Shopping Cart</a>
                          </li>
                          <li>
                            <a href="/checkout">Checkout</a>
                          </li>
                          <li>
                            <a href="/account">Account</a>
                          </li>
                          <li>
                            <a href="/register">Register</a>
                          </li>
                          <li>
                            <a href="/login">Login</a>
                          </li>
                          <li>
                            <a href="/404">Error 404</a>
                          </li>
                        </ul>
                      </li>
                      <li className="undefined">
                        <a href="/contact">Contact</a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="mobile-menu-btn d-lg-none">
                  <button className="mobile-menu-toggle">
                    <i className="fas fa-bars"></i>
                  </button>
                </div>
                <div className="header__action">
                  <ul>
                    <li>
                      <button className="search-toggle">
                        <i className="ion-ios-search-strong"></i>Search
                      </button>
                    </li>
                    <li>
                      <button className="cart">
                        <i className="ion-bag"></i> Cart <span>(0)</span>
                      </button>
                      <div className="mini-cart">
                        <h5>Your cart is empty</h5>
                      </div>
                    </li>
                    <li>
                      <button>
                        <i className="far fa-bars"></i>
                      </button>
                      <ul className="extra-info">
                        <li>
                          <div className="my-account">
                            <div className="extra-title">
                              <h5>My Account</h5>
                            </div>
                            <ul>
                              <li>
                                <a href="/login">Login</a>
                              </li>
                              <li>
                                <a href="/wishlist">Wishlist</a>
                              </li>
                              <li>
                                <a href="/cart">Cart</a>
                              </li>
                              <li>
                                <a href="/checkout">Checkout</a>
                              </li>
                              <li>
                                <a href="/register">Create Account</a>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <div className="lang">
                            <div className="extra-title">
                              <h5>Language</h5>
                            </div>
                            <ul>
                              <li>
                                <a href="/">English</a>
                              </li>
                              <li>
                                <a href="/">France</a>
                              </li>
                              <li>
                                <a href="/">Germany</a>
                              </li>
                              <li>
                                <a href="/">Bangla</a>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <div className="currency">
                            <div className="extra-title">
                              <h5>Currency</h5>
                            </div>
                            <ul>
                              <li>
                                <a href="/">USD - US Dollar</a>
                              </li>
                              <li>
                                <a href="/">EUR - Euro</a>
                              </li>
                              <li>
                                <a href="/">GBP - British Pound</a>
                              </li>
                              <li>
                                <a href="/">INR - Indian Rupee</a>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
