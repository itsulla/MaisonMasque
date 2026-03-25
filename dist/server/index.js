import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { RemixServer, Link, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { useRef, useEffect, useState, useCallback } from "react";
import { CartForm } from "@shopify/hydrogen";
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const markup = renderToString(
    /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url })
  );
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function AnnouncementBar() {
  return /* @__PURE__ */ jsx("div", { className: "w-full bg-ink py-2.5 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-cream text-[11px] uppercase tracking-[3px] font-body font-medium", children: [
    "Complimentary shipping on orders over",
    " ",
    /* @__PURE__ */ jsx("span", { className: "text-gold", children: "£45" }),
    " /",
    " ",
    /* @__PURE__ */ jsx("span", { className: "text-gold", children: "$60 AUD" }),
    " /",
    " ",
    /* @__PURE__ */ jsx("span", { className: "text-gold", children: "€50" }),
    " /",
    " ",
    /* @__PURE__ */ jsx("span", { className: "text-gold", children: "R750" }),
    " — Worldwide delivery"
  ] }) });
}
function Navigation({
  cartCount,
  onCartOpen,
  onMobileMenuOpen
}) {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 bg-cream/95 backdrop-blur-xl border-b border-sand", children: /* @__PURE__ */ jsxs("nav", { className: "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-8 flex-1", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/collections/the-five-rituals",
          className: "text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors",
          children: "The Rituals"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/quiz",
          className: "text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors",
          children: "Skin Quiz"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "lg:hidden",
        onClick: onMobileMenuOpen,
        "aria-label": "Open menu",
        children: /* @__PURE__ */ jsx(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            className: "w-6 h-6 text-ink",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
              }
            )
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("span", { className: "font-display text-[28px] uppercase tracking-[4px] text-ink", children: "MAISON MASQUE" }) }),
      /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase tracking-[3px] text-stone", children: "The House of Masks · Est. 2026" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-8 flex-1 justify-end", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "#subscription",
          className: "text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors",
          children: "Subscribe"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/account",
          className: "text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors",
          children: "Account"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onCartOpen,
          className: "relative text-xs uppercase tracking-[3px] text-walnut hover:text-gold transition-colors",
          children: [
            "Bag",
            cartCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-2 -right-4 bg-gold text-cream rounded-full text-[10px] w-4 h-4 flex items-center justify-center", children: cartCount })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        className: "lg:hidden relative",
        onClick: onCartOpen,
        "aria-label": "Open cart",
        children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: 1.5,
              stroke: "currentColor",
              className: "w-6 h-6 text-ink",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                }
              )
            }
          ),
          cartCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-2 -right-2 bg-gold text-cream rounded-full text-[10px] w-4 h-4 flex items-center justify-center", children: cartCount })
        ]
      }
    )
  ] }) });
}
const currencies = [
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "AUD", symbol: "A$" },
  { code: "EUR", symbol: "€" },
  { code: "ZAR", symbol: "R" }
];
function CurrencySelector({
  currentCurrency,
  onChange,
  className = ""
}) {
  return /* @__PURE__ */ jsx(
    "select",
    {
      value: currentCurrency,
      onChange: (e) => onChange(e.target.value),
      className: `border border-sand bg-cream text-stone text-xs uppercase tracking-[0.15em] py-2 px-3 font-body appearance-none cursor-pointer focus:outline-none focus:border-gold transition-colors duration-300 ${className}`.trim(),
      children: currencies.map(({ code, symbol }) => /* @__PURE__ */ jsxs("option", { value: code, children: [
        code,
        " (",
        symbol,
        ")"
      ] }, code))
    }
  );
}
const shopLinks = [
  { label: "The Five Rituals", href: "/collections/the-five-rituals" },
  { label: "All Masks", href: "/collections/all" },
  { label: "The Complete Ritual", href: "/collections/the-complete-ritual" },
  { label: "Subscribe", href: "#subscription" }
];
const discoverLinks = [
  { label: "Skin Ritual Quiz", href: "/quiz" },
  { label: "Ingredient Glossary", href: "/pages/ingredients" },
  { label: "The Practice", href: "/pages/the-practice" },
  { label: "Journal", href: "/journal" }
];
const careLinks = [
  { label: "Shipping & Returns", href: "/pages/shipping-returns" },
  { label: "Contact the Maison", href: "/pages/contact" },
  { label: "FAQ", href: "/pages/faq" },
  { label: "Privacy", href: "/pages/privacy" }
];
function FooterLinkColumn({
  heading,
  links: links2
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xs uppercase tracking-[3px] font-semibold text-ink mb-4", children: heading }),
    /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-3", children: links2.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      Link,
      {
        to: link.href,
        className: "text-sm text-stone hover:text-gold transition-colors",
        children: link.label
      }
    ) }, link.href)) })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "bg-cream border-t border-sand", children: /* @__PURE__ */ jsxs("div", { className: "py-16 px-6 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "font-display text-lg uppercase tracking-[4px] text-ink", children: "MAISON MASQUE" }),
        /* @__PURE__ */ jsx("p", { className: "text-[9px] uppercase tracking-[3px] text-stone mt-1", children: "The House of Masks · Est. 2026" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-stone leading-relaxed mt-4", children: "A curated ritual of five transformative masks, crafted with intention. Each mask is an invitation to pause, to honour the skin, and to return to yourself." }),
        /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(CurrencySelector, {}) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-12 md:border-l md:border-sand md:pl-12", children: [
        /* @__PURE__ */ jsx(FooterLinkColumn, { heading: "Shop", links: shopLinks }),
        /* @__PURE__ */ jsx(FooterLinkColumn, { heading: "Discover", links: discoverLinks }),
        /* @__PURE__ */ jsx(FooterLinkColumn, { heading: "Care", links: careLinks })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-sand flex flex-col sm:flex-row justify-between gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[3px] text-stone", children: "© 2026 Maison Masque" }),
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[3px] text-stone", children: "Curated with care · Shipped with reverence" })
    ] })
  ] }) });
}
function CartDrawer({ isOpen, onClose, cart }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const lines = ((_a = cart == null ? void 0 : cart.lines) == null ? void 0 : _a.nodes) ?? (cart == null ? void 0 : cart.lines) ?? [];
  const subtotal = ((_c = (_b = cart == null ? void 0 : cart.cost) == null ? void 0 : _b.subtotalAmount) == null ? void 0 : _c.amount) ?? ((_e = (_d = cart == null ? void 0 : cart.cost) == null ? void 0 : _d.totalAmount) == null ? void 0 : _e.amount) ?? "0";
  const currencyCode = ((_g = (_f = cart == null ? void 0 : cart.cost) == null ? void 0 : _f.subtotalAmount) == null ? void 0 : _g.currencyCode) ?? ((_i = (_h = cart == null ? void 0 : cart.cost) == null ? void 0 : _h.totalAmount) == null ? void 0 : _i.currencyCode) ?? "USD";
  const itemCount = lines.reduce(
    (total, line) => total + (line.quantity ?? 0),
    0
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `absolute inset-0 bg-ink/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`,
            onClick: onClose
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `absolute right-0 top-0 bg-cream w-96 max-w-[90vw] h-full flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-sand p-6", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "font-display text-xl text-ink", children: "Your Ritual" }),
                  itemCount > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-stone", children: [
                    itemCount,
                    " ",
                    itemCount === 1 ? "item" : "items"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onClose,
                    className: "text-ink",
                    "aria-label": "Close cart",
                    children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        strokeWidth: 1.5,
                        stroke: "currentColor",
                        className: "w-6 h-6",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            d: "M6 18 18 6M6 6l12 12"
                          }
                        )
                      }
                    )
                  }
                )
              ] }),
              lines.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-6", children: lines.map((line) => /* @__PURE__ */ jsx(CartLineItem, { line }, line.id)) }) }),
                /* @__PURE__ */ jsxs("div", { className: "border-t border-sand p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-body font-medium text-ink uppercase tracking-[2px]", children: "Subtotal" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-body font-medium text-ink", children: formatMoney$1(subtotal, currencyCode) })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-stone mb-4", children: "Complimentary shipping on orders over £45" }),
                  /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-gold mb-4" }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: (cart == null ? void 0 : cart.checkoutUrl) ?? "/checkout",
                      className: "block w-full bg-ink text-cream text-center py-3 text-xs uppercase tracking-[3px] font-body font-medium hover:bg-espresso transition-colors",
                      children: "Proceed to checkout"
                    }
                  )
                ] })
              ] }) : (
                /* Empty state */
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center p-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-xl text-stone mb-4", children: "Your ritual awaits" }),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/collections/the-five-rituals",
                      className: "inline-block border border-ink text-ink text-xs uppercase tracking-[3px] font-body font-medium px-8 py-3 hover:bg-ink hover:text-cream transition-colors",
                      children: "Explore the collection"
                    }
                  )
                ] })
              )
            ]
          }
        )
      ]
    }
  );
}
function CartLineItem({ line }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const merchandise = line.merchandise;
  const image = merchandise == null ? void 0 : merchandise.image;
  const title = ((_a = merchandise == null ? void 0 : merchandise.product) == null ? void 0 : _a.title) ?? (merchandise == null ? void 0 : merchandise.title) ?? "";
  const price = ((_c = (_b = line.cost) == null ? void 0 : _b.totalAmount) == null ? void 0 : _c.amount) ?? ((_e = (_d = line.cost) == null ? void 0 : _d.amountPerQuantity) == null ? void 0 : _e.amount) ?? "0";
  const currencyCode = ((_g = (_f = line.cost) == null ? void 0 : _f.totalAmount) == null ? void 0 : _g.currencyCode) ?? ((_i = (_h = line.cost) == null ? void 0 : _h.amountPerQuantity) == null ? void 0 : _i.currencyCode) ?? "USD";
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
    (image == null ? void 0 : image.url) && /* @__PURE__ */ jsx(
      "img",
      {
        src: image.url,
        alt: image.altText ?? title,
        className: "w-16 h-16 object-cover rounded"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-display text-sm text-ink leading-tight", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-stone mt-1", children: formatMoney$1(price, currencyCode) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
        /* @__PURE__ */ jsx(
          CartForm,
          {
            route: "/cart",
            action: CartForm.ACTIONS.LinesUpdate,
            inputs: {
              lines: [
                {
                  id: line.id,
                  quantity: Math.max(0, line.quantity - 1)
                }
              ]
            },
            children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "w-7 h-7 border border-sand flex items-center justify-center text-xs text-ink hover:border-gold transition-colors",
                "aria-label": "Decrease quantity",
                children: "−"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-ink font-body w-4 text-center", children: line.quantity }),
        /* @__PURE__ */ jsx(
          CartForm,
          {
            route: "/cart",
            action: CartForm.ACTIONS.LinesUpdate,
            inputs: {
              lines: [
                {
                  id: line.id,
                  quantity: line.quantity + 1
                }
              ]
            },
            children: /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "w-7 h-7 border border-sand flex items-center justify-center text-xs text-ink hover:border-gold transition-colors",
                "aria-label": "Increase quantity",
                children: "+"
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      CartForm,
      {
        route: "/cart",
        action: CartForm.ACTIONS.LinesRemove,
        inputs: { lineIds: [line.id] },
        children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "text-stone hover:text-ink transition-colors",
            "aria-label": "Remove item",
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 1.5,
                stroke: "currentColor",
                className: "w-4 h-4",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M6 18 18 6M6 6l12 12"
                  }
                )
              }
            )
          }
        )
      }
    )
  ] });
}
function formatMoney$1(amount, currencyCode) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode
  }).format(value);
}
const menuLinks = [
  { label: "The Rituals", href: "/collections/the-five-rituals" },
  { label: "Skin Quiz", href: "/quiz" },
  { label: "Subscribe", href: "#subscription" },
  { label: "Account", href: "/account" }
];
function MobileMenu({ isOpen, onClose }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `absolute inset-0 bg-ink/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`,
            onClick: onClose
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `absolute top-0 left-0 bg-cream w-80 max-w-[85vw] h-full p-8 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`,
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "absolute top-6 right-6 text-ink",
                  "aria-label": "Close menu",
                  children: /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      strokeWidth: 1.5,
                      stroke: "currentColor",
                      className: "w-6 h-6",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          d: "M6 18 18 6M6 6l12 12"
                        }
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "mb-10", children: /* @__PURE__ */ jsx("span", { className: "font-display text-lg uppercase tracking-[4px] text-ink", children: "MAISON MASQUE" }) }),
              /* @__PURE__ */ jsx("nav", { className: "flex flex-col", children: menuLinks.map((link) => /* @__PURE__ */ jsx(
                Link,
                {
                  to: link.href,
                  onClick: onClose,
                  className: "font-display text-lg text-ink py-3 border-b border-sand hover:text-gold transition-colors",
                  children: link.label
                },
                link.href
              )) })
            ]
          }
        )
      ]
    }
  );
}
function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      if (barRef.current) barRef.current.style.display = "none";
      return;
    }
    let ticking = false;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      if (barRef.current) {
        const pct = maxScroll > 0 ? scrollTop / maxScroll * 100 : 0;
        barRef.current.style.width = `${pct}%`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: barRef,
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        height: "2px",
        width: "0%",
        background: "#C5A55A"
      }
    }
  );
}
const appStyles = "/assets/app-Bd2eIabX.css";
function links() {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600&display=swap"
    },
    { rel: "stylesheet", href: appStyles }
  ];
}
const meta$7 = () => {
  return [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    {
      title: "Maison Masque | Korean Sheet Masks | The House of Masks"
    },
    {
      name: "description",
      content: "Curated Korean sheet masks from Biodance, Torriden, Abib, Mediheal and Numbuzin. Shipped worldwide to Australia, UK, Europe and South Africa."
    }
  ];
};
async function loader$5({ context }) {
  return { cart: null };
}
function HydrateFallback() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "bg-cream text-ink font-body antialiased", children: [
      /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "font-display text-2xl uppercase tracking-[4px] text-ink", children: "MAISON MASQUE" }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 w-8 h-px bg-gold mx-auto animate-pulse" })
      ] }) }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  var _a;
  const { cart } = useLoaderData();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartLines = ((_a = cart == null ? void 0 : cart.lines) == null ? void 0 : _a.nodes) ?? (cart == null ? void 0 : cart.lines) ?? [];
  const cartCount = cartLines.reduce(
    (total, line) => total + (line.quantity ?? 0),
    0
  );
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "bg-cream text-ink font-body antialiased", children: [
      /* @__PURE__ */ jsx("a", { href: "#main-content", className: "skip-to-content", children: "Skip to content" }),
      /* @__PURE__ */ jsx(ScrollProgress, {}),
      /* @__PURE__ */ jsx(AnnouncementBar, {}),
      /* @__PURE__ */ jsx(
        Navigation,
        {
          cartCount,
          onCartOpen: () => setCartOpen(true),
          onMobileMenuOpen: () => setMobileMenuOpen(true)
        }
      ),
      /* @__PURE__ */ jsx(
        MobileMenu,
        {
          isOpen: mobileMenuOpen,
          onClose: () => setMobileMenuOpen(false)
        }
      ),
      /* @__PURE__ */ jsx(
        CartDrawer,
        {
          isOpen: cartOpen,
          onClose: () => setCartOpen(false),
          cart
        }
      ),
      /* @__PURE__ */ jsx("main", { id: "main-content", children: /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HydrateFallback,
  default: App,
  links,
  loader: loader$5,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
const ritualConfig = {
  "biodance-collagen": {
    number: "1",
    numeral: "I",
    name: "Restore",
    theme: "Overnight hydrogel, turns transparent as collagen absorbs",
    gradient: "from-rose/30 to-ivory"
  },
  "torriden-dive-in": {
    number: "2",
    numeral: "II",
    name: "Drench",
    theme: "5 molecular weights of HA, vegan cellulose",
    gradient: "from-sage/30 to-ivory"
  },
  "abib-heartleaf": {
    number: "3",
    numeral: "III",
    name: "Calm",
    theme: "Microfibre gummy seal, heartleaf soothes redness",
    gradient: "from-sage/25 to-ivory"
  },
  "mediheal-nmf": {
    number: "4",
    numeral: "IV",
    name: "Replenish",
    theme: "2 billion sold, NMF floods parched skin",
    gradient: "from-rose/25 to-ivory"
  },
  "numbuzin-no3": {
    number: "5",
    numeral: "V",
    name: "Illuminate",
    theme: "Galactomyces ferment for glass skin, gentle daily use",
    gradient: "from-gold/20 to-ivory"
  }
};
function getRitualByHandle(handle) {
  return ritualConfig[handle] ?? null;
}
const DRIFT_DIRECTIONS = [
  "translate(-8px, -4px)",
  // up-left
  "translate(8px, -4px)",
  // up-right
  "translate(-6px, -6px)",
  // diagonal left
  "translate(6px, -2px)",
  // slight right
  "translate(-4px, -8px)"
  // mostly up, slight left
];
function RitualCard({ product, index, className = "" }) {
  var _a;
  const ritual = getRitualByHandle(product.handle);
  const price = (_a = product.priceRange) == null ? void 0 : _a.minVariantPrice;
  const cardRef = useRef(null);
  const drift = DRIFT_DIRECTIONS[index % DRIFT_DIRECTIONS.length];
  const formatPrice = (amount, currencyCode) => {
    const num = parseFloat(amount);
    const symbol = currencyCode === "GBP" ? "£" : currencyCode === "EUR" ? "€" : currencyCode === "AUD" ? "A$" : "$";
    return `${symbol}${Math.round(num)}`;
  };
  const handleMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg)";
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: cardRef,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      className: `ritual p-0 group hover:bg-ivory transition-all duration-500 will-change-transform ${className}`.trim(),
      children: [
        /* @__PURE__ */ jsx("div", { className: "ritual-img h-[280px] overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "ritual-img-inner w-full h-full transition-transform duration-[3000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform group-hover:scale-[1.05]",
            style: {
              "--drift": drift
            },
            children: product.featuredImage ? /* @__PURE__ */ jsx(
              "img",
              {
                src: product.featuredImage.url,
                alt: product.featuredImage.altText ?? product.title,
                className: "w-full h-full object-cover",
                loading: "lazy"
              }
            ) : /* @__PURE__ */ jsx(
              "div",
              {
                className: `w-full h-full bg-gradient-to-b ${(ritual == null ? void 0 : ritual.gradient) ?? "from-sand/30 to-ivory"} flex items-center justify-center`,
                children: /* @__PURE__ */ jsx("span", { className: "font-display text-7xl text-sand/60 select-none", children: (ritual == null ? void 0 : ritual.numeral) ?? "" })
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
          ritual && /* @__PURE__ */ jsxs("p", { className: "ritual-num text-[11px] uppercase tracking-[4px] font-semibold text-gold", children: [
            "Ritual ",
            ritual.numeral,
            " — ",
            ritual.name
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[3px] text-stone mt-1", children: product.vendor }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-[17px] font-medium mt-2", children: product.title }),
          ritual && /* @__PURE__ */ jsx("p", { className: "text-xs text-stone mt-2 leading-relaxed", children: ritual.theme }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-4", children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-xl", children: price ? formatPrice(price.amount, price.currencyCode) : "" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "ritual-add w-8 h-8 border border-sand flex items-center justify-center text-stone transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.92]",
                "aria-label": `Add ${product.title} to bag`,
                children: "+"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
  }
`;
const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFragment on Product {
    id
    title
    handle
    vendor
    description
    descriptionHtml
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      name
      values
    }
    variants(first: 10) {
      nodes {
        ...ProductVariantFragment
      }
    }
    metafields(
      identifiers: [
        {namespace: "custom", key: "ritual_number"}
        {namespace: "custom", key: "ritual_name"}
        {namespace: "custom", key: "ritual_description"}
        {namespace: "custom", key: "key_ingredient"}
      ]
    ) {
      key
      value
      namespace
    }
    sellingPlanGroups(first: 5) {
      nodes {
        name
        sellingPlans(first: 10) {
          nodes {
            id
            name
            options {
              name
              value
            }
            priceAdjustments {
              adjustmentValue {
                ... on SellingPlanPercentagePriceAdjustment {
                  adjustmentPercentage
                }
              }
              orderCount
            }
          }
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;
const COLLECTION_FRAGMENT = `#graphql
  fragment CollectionFragment on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 10) {
      nodes {
        ...ProductFragment
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;
const COLLECTION_QUERY = `#graphql
  query CollectionQuery(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...CollectionFragment
    }
  }
  ${COLLECTION_FRAGMENT}
`;
const PRODUCT_QUERY = `#graphql
  query ProductQuery(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;
const MOCK_COLLECTION = {
  title: "The Five Rituals",
  description: "Five masks. Five intentions. Each chosen from Korea's most revered houses.",
  handle: "the-five-rituals",
  products: {
    nodes: [
      {
        id: "gid://shopify/Product/mock-1",
        title: "Bio-Collagen Real Deep Mask",
        handle: "biodance-collagen",
        vendor: "Biodance",
        featuredImage: null,
        priceRange: {
          minVariantPrice: { amount: "24.00", currencyCode: "USD" }
        }
      },
      {
        id: "gid://shopify/Product/mock-2",
        title: "DIVE-IN Hyaluronic Acid Mask",
        handle: "torriden-dive-in",
        vendor: "Torriden",
        featuredImage: null,
        priceRange: {
          minVariantPrice: { amount: "38.00", currencyCode: "USD" }
        }
      },
      {
        id: "gid://shopify/Product/mock-3",
        title: "Heartleaf Gummy Sheet Mask",
        handle: "abib-heartleaf",
        vendor: "Abib",
        featuredImage: null,
        priceRange: {
          minVariantPrice: { amount: "32.00", currencyCode: "USD" }
        }
      },
      {
        id: "gid://shopify/Product/mock-4",
        title: "N.M.F Ampoule Mask",
        handle: "mediheal-nmf",
        vendor: "Mediheal",
        featuredImage: null,
        priceRange: {
          minVariantPrice: { amount: "18.00", currencyCode: "USD" }
        }
      },
      {
        id: "gid://shopify/Product/mock-5",
        title: "No.3 Skin Softening Mask",
        handle: "numbuzin-no3",
        vendor: "Numbuzin",
        featuredImage: null,
        priceRange: {
          minVariantPrice: { amount: "26.00", currencyCode: "USD" }
        }
      }
    ]
  }
};
const meta$6 = ({ data }) => {
  const collection = data == null ? void 0 : data.collection;
  return [
    {
      title: collection ? `${collection.title} | Maison Masque` : "Collection | Maison Masque"
    },
    {
      name: "description",
      content: (collection == null ? void 0 : collection.description) ?? "Shop curated Korean sheet masks at Maison Masque."
    }
  ];
};
async function loader$4({ params, context }) {
  const { handle } = params;
  try {
    const { collection } = await context.storefront.query(COLLECTION_QUERY, {
      variables: { handle }
    });
    if (!collection) {
      throw new Response("Collection not found", { status: 404 });
    }
    return { collection };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Failed to fetch collection:", error);
    return { collection: { ...MOCK_COLLECTION, handle } };
  }
}
function CollectionRoute() {
  var _a;
  const { collection } = useLoaderData();
  const products = ((_a = collection.products) == null ? void 0 : _a.nodes) ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 py-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body", children: "Collection" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(28px,3.5vw,42px)] mt-3", children: collection.title }),
      collection.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-stone mt-3 max-w-xl mx-auto", children: collection.description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border border-sand", children: products.map((product, index) => /* @__PURE__ */ jsx(
      "a",
      {
        href: `/products/${product.handle}`,
        className: "block",
        children: /* @__PURE__ */ jsx(
          RitualCard,
          {
            product,
            index,
            className: index < products.length - 1 ? "border-r border-sand" : ""
          }
        )
      },
      product.id
    )) }),
    products.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-24", children: [
      /* @__PURE__ */ jsx("div", { className: "w-px h-[40px] bg-sand mx-auto mb-8" }),
      /* @__PURE__ */ jsx("span", { className: "text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body", children: "Nothing here yet" }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl text-stone mt-4", children: "This collection awaits its first ritual" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-stone mt-3 max-w-sm mx-auto leading-relaxed", children: "We are carefully curating this selection. In the meantime, explore our signature collection." }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/collections/the-five-rituals",
          className: "inline-block mt-8 font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 bg-ink text-cream hover:bg-espresso hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
          children: "The Five Rituals"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-[60px] h-px bg-gold mx-auto mt-12" })
    ] })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CollectionRoute,
  loader: loader$4,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const POLICY_QUERY = `#graphql
  query PolicyQuery($privacyPolicy: Boolean!, $termsOfService: Boolean!, $refundPolicy: Boolean!, $shippingPolicy: Boolean!) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        title
        body
        handle
      }
      termsOfService @include(if: $termsOfService) {
        title
        body
        handle
      }
      refundPolicy @include(if: $refundPolicy) {
        title
        body
        handle
      }
      shippingPolicy @include(if: $shippingPolicy) {
        title
        body
        handle
      }
    }
  }
`;
const POLICY_MAP = {
  "privacy-policy": "privacyPolicy",
  "terms-of-service": "termsOfService",
  "refund-policy": "refundPolicy",
  "shipping-policy": "shippingPolicy"
};
const MOCK_POLICIES = {
  "privacy-policy": {
    title: "Privacy Policy",
    body: "<p>At Maison Masque, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our store.</p><p>We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us. This may include your name, email address, postal address, phone number, and payment information.</p><p>For questions about this policy, please contact the maison.</p>"
  },
  "terms-of-service": {
    title: "Terms of Service",
    body: "<p>Welcome to Maison Masque. By accessing or using our website and services, you agree to be bound by these terms of service. Please read them carefully.</p><p>All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice.</p><p>For the complete terms, please contact the maison.</p>"
  },
  "refund-policy": {
    title: "Refund Policy",
    body: "<p>At Maison Masque, we want you to be completely satisfied with your ritual. If for any reason you are not happy with your purchase, we offer a 30-day return policy for unopened products in their original packaging.</p><p>To initiate a return, please contact the maison with your order number and reason for return.</p>"
  },
  "shipping-policy": {
    title: "Shipping Policy",
    body: "<p>All orders are shipped with care and reverence. We offer complimentary shipping on orders over the following thresholds: Australia $60 AUD, United Kingdom £45, European Union €50, South Africa R750.</p><p>Estimated delivery times: Australia 5–8 days, UK 7–12 days, EU 8–14 days, South Africa 10–16 days, Rest of World 10–21 days.</p>"
  }
};
const meta$5 = ({ data }) => {
  var _a;
  return [
    {
      title: ((_a = data == null ? void 0 : data.policy) == null ? void 0 : _a.title) ? `${data.policy.title} | Maison Masque` : "Policy | Maison Masque"
    }
  ];
};
async function loader$3({ params, context }) {
  const { handle } = params;
  const policyKey = POLICY_MAP[handle];
  if (!policyKey) {
    throw new Response("Policy not found", { status: 404 });
  }
  try {
    const variables = {
      privacyPolicy: policyKey === "privacyPolicy",
      termsOfService: policyKey === "termsOfService",
      refundPolicy: policyKey === "refundPolicy",
      shippingPolicy: policyKey === "shippingPolicy"
    };
    const { shop } = await context.storefront.query(POLICY_QUERY, {
      variables
    });
    const policy = shop[policyKey];
    if (!policy) {
      const mock = MOCK_POLICIES[handle];
      if (!mock) throw new Response("Policy not found", { status: 404 });
      return { policy: mock };
    }
    return { policy };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Failed to fetch policy:", error);
    const mock = MOCK_POLICIES[handle];
    if (!mock) throw new Response("Policy not found", { status: 404 });
    return { policy: mock };
  }
}
function PolicyRoute() {
  const { policy } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 py-16", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(28px,3.5vw,42px)] text-center mb-12", children: policy.title }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "prose prose-sm max-w-none text-stone leading-relaxed\n          prose-headings:font-display prose-headings:text-ink\n          prose-a:text-gold prose-a:no-underline hover:prose-a:underline\n          prose-p:mb-4",
        dangerouslySetInnerHTML: { __html: policy.body }
      }
    )
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PolicyRoute,
  loader: loader$3,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
let ProductPage;
try {
  ProductPage = require("~/components/product/ProductPage").ProductPage;
} catch {
  ProductPage = ({ product }) => /* @__PURE__ */ jsx(DefaultProductLayout, { product });
}
const MOCK_PRODUCT = {
  id: "gid://shopify/Product/mock",
  title: "Bio-Collagen Real Deep Mask",
  handle: "biodance-collagen",
  vendor: "Biodance",
  descriptionHtml: "<p>An overnight hydrogel mask that turns transparent as collagen absorbs into the skin. Ultra-low molecular collagen (243 daltons) penetrates deep for visible plumping and hydration.</p>",
  featuredImage: null,
  priceRange: {
    minVariantPrice: { amount: "24.00", currencyCode: "USD" }
  },
  variants: {
    nodes: [
      {
        id: "gid://shopify/ProductVariant/mock-1",
        title: "Default",
        availableForSale: true,
        price: { amount: "24.00", currencyCode: "USD" }
      }
    ]
  },
  metafields: [
    { key: "ritual_number", value: "I" },
    { key: "ritual_name", value: "Restore" }
  ]
};
const meta$4 = ({ data }) => {
  const product = data == null ? void 0 : data.product;
  return [
    {
      title: product ? `${product.title} | Maison Masque` : "Product | Maison Masque"
    },
    {
      name: "description",
      content: product ? `Shop ${product.title} by ${product.vendor} at Maison Masque. Curated Korean sheet masks shipped worldwide.` : "Shop curated Korean sheet masks at Maison Masque."
    }
  ];
};
async function loader$2({ params, context }) {
  const { handle } = params;
  try {
    const { product } = await context.storefront.query(PRODUCT_QUERY, {
      variables: { handle }
    });
    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }
    return { product };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Failed to fetch product:", error);
    return { product: { ...MOCK_PRODUCT, handle } };
  }
}
function DefaultProductLayout({ product }) {
  var _a, _b, _c;
  const price = (_a = product.priceRange) == null ? void 0 : _a.minVariantPrice;
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 py-16", children: [
    /* @__PURE__ */ jsxs("nav", { className: "text-xs text-stone mb-8", children: [
      /* @__PURE__ */ jsx("a", { href: "/", className: "hover:text-gold transition-colors", children: "Home" }),
      /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/collections/the-five-rituals",
          className: "hover:text-gold transition-colors",
          children: "The Five Rituals"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
      /* @__PURE__ */ jsx("span", { className: "text-ink", children: product.title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-16", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-b from-sand/20 to-cream aspect-square flex items-center justify-center", children: product.featuredImage ? /* @__PURE__ */ jsx(
        "img",
        {
          src: product.featuredImage.url,
          alt: product.featuredImage.altText ?? product.title,
          className: "w-full h-full object-cover"
        }
      ) : /* @__PURE__ */ jsx("span", { className: "font-display text-2xl text-sand", children: product.vendor }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
        ((_b = product.metafields) == null ? void 0 : _b[0]) && /* @__PURE__ */ jsxs("p", { className: "text-[11px] uppercase tracking-[4px] font-semibold text-gold mb-2", children: [
          "Ritual ",
          product.metafields[0].value,
          " —",
          " ",
          (_c = product.metafields[1]) == null ? void 0 : _c.value
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-[3px] text-stone", children: product.vendor }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-[28px] mt-2", children: product.title }),
        price && /* @__PURE__ */ jsxs("p", { className: "font-display text-2xl mt-4", children: [
          "$",
          parseFloat(price.amount).toFixed(0)
        ] }),
        product.descriptionHtml && /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-sm text-stone leading-relaxed mt-6 prose prose-sm",
            dangerouslySetInnerHTML: { __html: product.descriptionHtml }
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "mt-8 w-full bg-ink text-cream py-4 text-xs uppercase tracking-[3px] font-body font-medium hover:bg-espresso transition-colors", children: "Add to ritual" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-6 mt-6 text-[10px] uppercase tracking-[2px] text-stone", children: [
          /* @__PURE__ */ jsx("span", { children: "Authentic" }),
          /* @__PURE__ */ jsx("span", { children: "·" }),
          /* @__PURE__ */ jsx("span", { children: "Ships from HK" }),
          /* @__PURE__ */ jsx("span", { children: "·" }),
          /* @__PURE__ */ jsx("span", { children: "Free returns" })
        ] })
      ] })
    ] })
  ] });
}
function ProductRoute() {
  const { product } = useLoaderData();
  return /* @__PURE__ */ jsx(ProductPage, { product });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductRoute,
  loader: loader$2,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function SectionLabel({ children, className = "" }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body ${className}`.trim(),
      children
    }
  );
}
const baseStyles = "inline-block font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]";
const variantStyles = {
  dark: "bg-ink text-cream hover:bg-espresso hover:shadow-[0_4px_12px_rgba(26,23,20,0.15)]",
  outline: "bg-transparent border border-sand text-ink hover:text-gold hover:border-gold hover:shadow-[0_4px_12px_rgba(197,165,90,0.1)]"
};
function Button({
  variant,
  children,
  className = "",
  href,
  onClick,
  type = "button"
}) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();
  if (href) {
    return /* @__PURE__ */ jsx(Link, { to: href, className: classes, onClick, children });
  }
  return /* @__PURE__ */ jsx("button", { type, className: classes, onClick, children });
}
function Hero() {
  return /* @__PURE__ */ jsxs("section", { className: "pt-[100px] pb-20 text-center max-w-3xl mx-auto px-6", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "w-px h-[60px] bg-sand mx-auto mb-8 animate-fade-up",
        style: { animationDelay: "0s" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "animate-fade-up", style: { animationDelay: "0.1s" }, children: /* @__PURE__ */ jsx(SectionLabel, { children: "Collection I" }) }),
    /* @__PURE__ */ jsxs(
      "h1",
      {
        className: "font-display text-[clamp(42px,6vw,80px)] tracking-[-1px] leading-[1.1] mt-4 animate-fade-up",
        style: { animationDelay: "0.2s" },
        children: [
          "The Five ",
          /* @__PURE__ */ jsx("em", { className: "italic text-gold", children: "Rituals" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-px w-[60px] bg-gold mx-auto mt-6 mb-8 animate-line-grow",
        style: { animationDelay: "0.5s" }
      }
    ),
    /* @__PURE__ */ jsx(
      "p",
      {
        className: "text-base text-stone max-w-xl mx-auto leading-relaxed animate-fade-up",
        style: { animationDelay: "0.3s" },
        children: "Five masks. Five intentions. Each chosen from Korea's most revered houses and delivered to your door. This is skincare as ceremony."
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex gap-4 justify-center mt-10 flex-wrap animate-fade-up",
        style: { animationDelay: "0.4s" },
        children: [
          /* @__PURE__ */ jsx(Button, { variant: "dark", href: "#rituals", children: "Explore the collection" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", href: "/quiz", children: "Take the skin ritual quiz" })
        ]
      }
    )
  ] });
}
function Divider({ className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `flex justify-center py-12 ${className}`.trim(), children: /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rotate-45 bg-gold" }) });
}
function FiveRituals({ products }) {
  return /* @__PURE__ */ jsxs("section", { id: "rituals", className: "py-20 px-6 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: "The Five Rituals" }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-[clamp(28px,3.5vw,42px)] mt-3", children: "One mask for every intention" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-stone mt-3", children: "Curated from Korea's most revered skincare houses" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 border border-sand", children: products.map((product, index) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      RitualCard,
      {
        product,
        index,
        className: index < products.length - 1 ? "border-r border-sand" : ""
      }
    ) }, product.id)) }),
    /* @__PURE__ */ jsx("div", { className: "text-center mt-12", children: /* @__PURE__ */ jsx(Button, { variant: "dark", href: "/products/the-complete-ritual", children: "The Complete Ritual — All five for £99" }) })
  ] });
}
function Seal({ className = "" }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative flex items-center justify-center w-48 h-48 ${className}`.trim(),
      children: [
        /* @__PURE__ */ jsx("div", { className: "seal-circle-outer absolute inset-0 rounded-full border border-gold/30" }),
        /* @__PURE__ */ jsx("div", { className: "seal-circle-middle absolute w-40 h-40 rounded-full border border-gold/20" }),
        /* @__PURE__ */ jsx("div", { className: "seal-circle-inner absolute w-32 h-32 rounded-full border border-gold/40" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center justify-center text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "font-display text-4xl text-gold", children: "MM" }),
          /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase tracking-[3px] text-gold/60 mt-1", children: "Est. MMXXVI" }),
          /* @__PURE__ */ jsx("span", { className: "font-display italic text-xs text-gold/50 mt-0.5", children: "The House of Masks" })
        ] })
      ]
    }
  );
}
function Philosophy() {
  return /* @__PURE__ */ jsxs("section", { className: "philosophy in-view py-24 px-6 overflow-hidden relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-cream via-ink/90 to-ink -z-10" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full border border-gold/5" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-[200px] left-[60%] w-[300px] h-[300px] rounded-full border border-gold/5" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-[100px] left-[30%] w-[200px] h-[200px] rounded-full border border-gold/5" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-gold-light text-[11px] uppercase tracking-[4px] font-semibold font-body", children: "Our Philosophy" }),
        /* @__PURE__ */ jsxs("h2", { className: "font-display text-[clamp(28px,3.5vw,42px)] text-cream mt-4 leading-snug", children: [
          "We believe a mask is not",
          " ",
          /* @__PURE__ */ jsx("em", { className: "italic text-gold-light", children: "skincare." }),
          " It is a",
          " ",
          /* @__PURE__ */ jsx("em", { className: "italic text-gold-light", children: "moment." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-cream/45 leading-relaxed mt-6", children: "In a world of ten-step routines and algorithm-driven hauls, we chose a different path. Maison Masque curates only five masks — each selected from Korea's most revered skincare houses for a single, clear intention. We source directly from Hong Kong, authenticate every batch, and ship with the care of a house that believes in fewer, better things." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-cream/45 leading-relaxed mt-6", children: "A sheet mask is fifteen minutes of stillness. A veil between the world and your skin. We don't sell products — we offer rituals. Each one an invitation to pause, to breathe, to feel the difference between routine and ceremony." }),
        /* @__PURE__ */ jsxs("div", { className: "philo-stats flex gap-8 mt-10", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-display text-3xl text-gold", children: "5" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[3px] text-cream/40 mt-1", children: "Curated Brands" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-display text-3xl text-gold", children: "40+" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[3px] text-cream/40 mt-1", children: "Countries" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-display text-3xl text-gold", children: "100%" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[3px] text-cream/40 mt-1", children: "Authenticated" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(Seal, {}) })
    ] })
  ] });
}
let RitualGuide;
let Subscription;
try {
  RitualGuide = require("~/components/home/RitualGuide").RitualGuide;
} catch {
  RitualGuide = () => null;
}
try {
  Subscription = require("~/components/home/Subscription").Subscription;
} catch {
  Subscription = () => null;
}
const meta$3 = () => {
  return [
    {
      title: "Maison Masque | Korean Sheet Masks | The House of Masks"
    },
    {
      name: "description",
      content: "Curated Korean sheet masks from Biodance, Torriden, Abib, Mediheal and Numbuzin. Shipped worldwide to Australia, UK, Europe and South Africa."
    }
  ];
};
const MOCK_PRODUCTS = [
  {
    id: "gid://shopify/Product/mock-1",
    title: "Bio-Collagen Real Deep Mask",
    handle: "biodance-collagen",
    vendor: "Biodance",
    featuredImage: null,
    priceRange: {
      minVariantPrice: { amount: "24.00", currencyCode: "USD" }
    },
    metafields: [
      { key: "ritual_number", value: "I" },
      { key: "ritual_name", value: "Restore" }
    ]
  },
  {
    id: "gid://shopify/Product/mock-2",
    title: "DIVE-IN Hyaluronic Acid Mask",
    handle: "torriden-dive-in",
    vendor: "Torriden",
    featuredImage: null,
    priceRange: {
      minVariantPrice: { amount: "38.00", currencyCode: "USD" }
    },
    metafields: [
      { key: "ritual_number", value: "II" },
      { key: "ritual_name", value: "Drench" }
    ]
  },
  {
    id: "gid://shopify/Product/mock-3",
    title: "Heartleaf Gummy Sheet Mask",
    handle: "abib-heartleaf",
    vendor: "Abib",
    featuredImage: null,
    priceRange: {
      minVariantPrice: { amount: "32.00", currencyCode: "USD" }
    },
    metafields: [
      { key: "ritual_number", value: "III" },
      { key: "ritual_name", value: "Calm" }
    ]
  },
  {
    id: "gid://shopify/Product/mock-4",
    title: "N.M.F Ampoule Mask",
    handle: "mediheal-nmf",
    vendor: "Mediheal",
    featuredImage: null,
    priceRange: {
      minVariantPrice: { amount: "18.00", currencyCode: "USD" }
    },
    metafields: [
      { key: "ritual_number", value: "IV" },
      { key: "ritual_name", value: "Replenish" }
    ]
  },
  {
    id: "gid://shopify/Product/mock-5",
    title: "No.3 Skin Softening Mask",
    handle: "numbuzin-no3",
    vendor: "Numbuzin",
    featuredImage: null,
    priceRange: {
      minVariantPrice: { amount: "26.00", currencyCode: "USD" }
    },
    metafields: [
      { key: "ritual_number", value: "V" },
      { key: "ritual_name", value: "Illuminate" }
    ]
  }
];
async function loader$1({ context }) {
  var _a;
  try {
    const { collection } = await context.storefront.query(COLLECTION_QUERY, {
      variables: { handle: "the-five-rituals" }
    });
    if (!collection) {
      return { products: MOCK_PRODUCTS };
    }
    const products = ((_a = collection.products) == null ? void 0 : _a.nodes) ?? [];
    return { products: products.length > 0 ? products : MOCK_PRODUCTS };
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    return { products: MOCK_PRODUCTS };
  }
}
function Homepage() {
  const { products } = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx(FiveRituals, { products }),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx(Philosophy, {}),
    /* @__PURE__ */ jsx(Divider, {}),
    RitualGuide && /* @__PURE__ */ jsx(RitualGuide, {}),
    RitualGuide && /* @__PURE__ */ jsx(Divider, {}),
    Subscription && /* @__PURE__ */ jsx(Subscription, {})
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Homepage,
  loader: loader$1,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const meta$2 = () => {
  return [
    { title: "Your Ritual | Maison Masque" },
    {
      name: "description",
      content: "Review your curated selection of Korean sheet masks."
    }
  ];
};
async function loader({ context }) {
  var _a, _b;
  try {
    const cart = await ((_a = context.cart) == null ? void 0 : _a.get());
    const lines = ((_b = cart == null ? void 0 : cart.lines) == null ? void 0 : _b.nodes) ?? (cart == null ? void 0 : cart.lines) ?? [];
    if (!cart || lines.length === 0) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/" }
      });
    }
    return { cart };
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return new Response(null, {
      status: 302,
      headers: { Location: "/" }
    });
  }
}
function formatMoney(amount, currencyCode) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode
  }).format(value);
}
function CartPage() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const { cart } = useLoaderData();
  const lines = ((_a = cart == null ? void 0 : cart.lines) == null ? void 0 : _a.nodes) ?? (cart == null ? void 0 : cart.lines) ?? [];
  const subtotal = ((_c = (_b = cart == null ? void 0 : cart.cost) == null ? void 0 : _b.subtotalAmount) == null ? void 0 : _c.amount) ?? ((_e = (_d = cart == null ? void 0 : cart.cost) == null ? void 0 : _d.totalAmount) == null ? void 0 : _e.amount) ?? "0";
  const currencyCode = ((_g = (_f = cart == null ? void 0 : cart.cost) == null ? void 0 : _f.subtotalAmount) == null ? void 0 : _g.currencyCode) ?? ((_i = (_h = cart == null ? void 0 : cart.cost) == null ? void 0 : _h.totalAmount) == null ? void 0 : _i.currencyCode) ?? "USD";
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 py-16", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(28px,3.5vw,42px)] text-center mb-12", children: "Your Ritual" }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-sand", children: lines.map((line) => {
      var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2;
      const merchandise = line.merchandise;
      const image = merchandise == null ? void 0 : merchandise.image;
      const title = ((_a2 = merchandise == null ? void 0 : merchandise.product) == null ? void 0 : _a2.title) ?? (merchandise == null ? void 0 : merchandise.title) ?? "";
      const linePrice = ((_c2 = (_b2 = line.cost) == null ? void 0 : _b2.totalAmount) == null ? void 0 : _c2.amount) ?? ((_e2 = (_d2 = line.cost) == null ? void 0 : _d2.amountPerQuantity) == null ? void 0 : _e2.amount) ?? "0";
      const lineCurrency = ((_g2 = (_f2 = line.cost) == null ? void 0 : _f2.totalAmount) == null ? void 0 : _g2.currencyCode) ?? ((_i2 = (_h2 = line.cost) == null ? void 0 : _h2.amountPerQuantity) == null ? void 0 : _i2.currencyCode) ?? "USD";
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex gap-6 py-6 border-b border-sand",
          children: [
            (image == null ? void 0 : image.url) && /* @__PURE__ */ jsx(
              "img",
              {
                src: image.url,
                alt: image.altText ?? title,
                className: "w-20 h-20 object-cover"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-display text-base text-ink", children: title }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-stone mt-1", children: [
                "Qty: ",
                line.quantity
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-display text-base", children: formatMoney(linePrice, lineCurrency) })
          ]
        },
        line.id
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-8 mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm font-body font-medium uppercase tracking-[2px]", children: "Subtotal" }),
      /* @__PURE__ */ jsx("span", { className: "font-display text-xl", children: formatMoney(subtotal, currencyCode) })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-stone mb-6", children: "Complimentary shipping on orders over £45" }),
    /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-gold mb-6" }),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: (cart == null ? void 0 : cart.checkoutUrl) ?? "/checkout",
        className: "block w-full bg-ink text-cream text-center py-4 text-xs uppercase tracking-[3px] font-body font-medium hover:bg-espresso transition-colors",
        children: "Proceed to checkout"
      }
    )
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CartPage,
  loader,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
let SkinQuiz;
try {
  SkinQuiz = require("~/components/quiz/SkinQuiz").SkinQuiz;
} catch {
  SkinQuiz = SkinQuizPlaceholder;
}
const meta$1 = () => {
  return [
    { title: "Find Your Ritual | Maison Masque" },
    {
      name: "description",
      content: "Take the Maison Masque skin ritual quiz to discover which Korean sheet mask is perfect for your skin type and concerns."
    }
  ];
};
function SkinQuizPlaceholder() {
  return /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto px-6 py-20 text-center", children: [
    /* @__PURE__ */ jsx("span", { className: "text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body", children: "Discover Your Ritual" }),
    /* @__PURE__ */ jsxs("h1", { className: "font-display text-[clamp(28px,3.5vw,42px)] mt-3", children: [
      "Find Your ",
      /* @__PURE__ */ jsx("em", { className: "italic text-gold", children: "Perfect" }),
      " Mask"
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-stone mt-4 max-w-md mx-auto leading-relaxed", children: "Answer five simple questions about your skin type, concerns, and preferences. We will recommend the ritual that is right for you." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 border border-sand p-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-[3px] text-stone mb-6", children: "Step 1 of 5" }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-sand mb-8", children: /* @__PURE__ */ jsx("div", { className: "w-1/5 h-full bg-gold" }) }),
      /* @__PURE__ */ jsx("h2", { className: "font-display text-xl mb-6", children: "What is your skin type?" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: ["Dry", "Oily", "Combination", "Sensitive"].map((option) => /* @__PURE__ */ jsx(
        "button",
        {
          className: "border border-sand py-4 px-6 text-sm text-ink hover:border-gold hover:text-gold transition-colors",
          children: option
        },
        option
      )) }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-stone mt-8", children: [
        "Quiz functionality coming soon. In the meantime, explore",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/collections/the-five-rituals",
            className: "text-gold hover:underline",
            children: "The Five Rituals"
          }
        ),
        "."
      ] })
    ] })
  ] });
}
function QuizRoute() {
  return /* @__PURE__ */ jsx(SkinQuiz, {});
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: QuizRoute,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [{ title: "Page Not Found | Maison Masque" }];
};
function NotFound() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-[80vh] flex items-center justify-center px-6", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md", children: [
    /* @__PURE__ */ jsx("div", { className: "w-px h-[40px] bg-sand mx-auto mb-8" }),
    /* @__PURE__ */ jsx("span", { className: "text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body", children: "Lost in the Maison" }),
    /* @__PURE__ */ jsx("h1", { className: "font-display text-[clamp(48px,8vw,96px)] leading-none mt-4 text-sand", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-stone mt-4 leading-relaxed", children: "The page you seek has vanished like a mask after the ritual. Perhaps it was never meant to be found." }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 justify-center mt-10 flex-wrap", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "inline-block font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 bg-ink text-cream hover:bg-espresso hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
          children: "Return home"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/quiz",
          className: "inline-block font-body font-semibold text-xs uppercase tracking-[0.2em] py-3.5 px-9 transition-all duration-300 bg-transparent border border-sand text-ink hover:text-gold hover:border-gold hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]",
          children: "Take the quiz"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-[60px] h-px bg-gold mx-auto mt-12" })
  ] }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NotFound,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CK6tc9UN.js", "imports": ["/assets/jsx-runtime-CASrxSZM.js", "/assets/components-Bobdr4P6.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BLEkvMSN.js", "imports": ["/assets/jsx-runtime-CASrxSZM.js", "/assets/components-Bobdr4P6.js"], "css": [] }, "routes/collections.$handle": { "id": "routes/collections.$handle", "parentId": "root", "path": "collections/:handle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/collections._handle-LVKBkn2b.js", "imports": ["/assets/jsx-runtime-CASrxSZM.js", "/assets/RitualCard-Dami-g8A.js", "/assets/components-Bobdr4P6.js"], "css": [] }, "routes/policies.$handle": { "id": "routes/policies.$handle", "parentId": "root", "path": "policies/:handle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/policies._handle-DxQs0uYD.js", "imports": ["/assets/jsx-runtime-CASrxSZM.js", "/assets/components-Bobdr4P6.js"], "css": [] }, "routes/products.$handle": { "id": "routes/products.$handle", "parentId": "root", "path": "products/:handle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/products._handle-CXCnxV6W.js", "imports": ["/assets/jsx-runtime-CASrxSZM.js", "/assets/components-Bobdr4P6.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-C2tbHyXj.js", "imports": ["/assets/jsx-runtime-CASrxSZM.js", "/assets/components-Bobdr4P6.js", "/assets/RitualCard-Dami-g8A.js"], "css": [] }, "routes/cart": { "id": "routes/cart", "parentId": "root", "path": "cart", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cart-Bfbr7nXH.js", "imports": ["/assets/jsx-runtime-CASrxSZM.js", "/assets/components-Bobdr4P6.js"], "css": [] }, "routes/quiz": { "id": "routes/quiz", "parentId": "root", "path": "quiz", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/quiz-6erz818c.js", "imports": ["/assets/jsx-runtime-CASrxSZM.js"], "css": [] }, "routes/$": { "id": "routes/$", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_-D2cY_2Ux.js", "imports": ["/assets/jsx-runtime-CASrxSZM.js", "/assets/components-Bobdr4P6.js"], "css": [] } }, "url": "/assets/manifest-df6f8639.js", "version": "df6f8639" };
const mode = "production";
const assetsBuildDirectory = "dist/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/collections.$handle": {
    id: "routes/collections.$handle",
    parentId: "root",
    path: "collections/:handle",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/policies.$handle": {
    id: "routes/policies.$handle",
    parentId: "root",
    path: "policies/:handle",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/products.$handle": {
    id: "routes/products.$handle",
    parentId: "root",
    path: "products/:handle",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route4
  },
  "routes/cart": {
    id: "routes/cart",
    parentId: "root",
    path: "cart",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/quiz": {
    id: "routes/quiz",
    parentId: "root",
    path: "quiz",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/$": {
    id: "routes/$",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
