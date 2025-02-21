const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function setAccessToken(token) {
  localStorage.setItem('token', token);
}

function getAccessToken() {
  return localStorage.getItem('token');
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

async function checkResponse(resp) {
  const contentType = resp.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return await resp.json();
  } else {
    throw new Error("Unexpected content type: " + contentType);
  }
}

async function registerUser({ fullname, email, password }) {
  const resp = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fullname, email, password }),
  });
  return await checkResponse(resp);
}

async function loginUser({ email, password }) {
  const resp = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await checkResponse(resp);

  if (data.accessToken) {
    setAccessToken(data.accessToken);
    await fetchUserDetails();
  }
  return data;
}

function logoutUser() {
  localStorage.clear();
}

async function createUserCart(products) {
  const resp = await fetch(`${API_URL}/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify(products.length ? { products } : {}),
  });
  return await checkResponse(resp);
}

async function getUserCart() {
  const userID = getUser()._id;
  const resp = await fetch(`${API_URL}/carts/${userID}`, {
    headers: {
      "x-access-token": getAccessToken(),
    }
  });
  const cart = await checkResponse(resp);
  if (cart.products) {
    cart.products = cart.products.map(product => (
      {
        id: product.productID._id,
        title: product.productID.title,
        price: product.productID.price,
        image: product.productID.image,
        quantity: product.quantity,
      }
    ));
  }
  return cart;
}

async function addProductsToCart(products) {
  const userID = getUser()._id;
  const resp = await fetch(`${API_URL}/carts/${userID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify({ products }),
  });
  return await checkResponse(resp);
}

async function removeProductFromCart(productID) {
  return await patchCart(productID, 0);
}

async function patchCart(productID, quantity) {
  const userID = getUser()._id;
  const resp = await fetch(`${API_URL}/carts/${userID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify({ productID, quantity }),
  });
  return await checkResponse(resp);
}

async function clearCart() {
  const resp = await fetch(`${API_URL}/carts/clear`, {
    method: "POST",
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  return await checkResponse(resp);
}

async function fetchUserDetails() {
  const resp = await fetch(`${API_URL}/users/me`, {
    headers: {
      "x-access-token": getAccessToken(),
    }
  });
  const { status, user } = await checkResponse(resp);
  if (status == "ok") {
    if (!user.avatarSrc) {
      user.avatarSrc = `https://avatars.dicebear.com/api/initials/${user.fullname}.svg`;
    }
    setUser(user);
  }
  return { status, user };
}

async function fetchProducts(category, newArrivals = false) {
  let query = `new=${newArrivals ? "true" : "false"}${category ? "&category=" + category : ""}`;
  const resp = await fetch(`${API_URL}/products?${query}`);
  return await checkResponse(resp);
}

async function fetchProduct(id) {
  const resp = await fetch(`${API_URL}/products/${id}`);
  return await checkResponse(resp);
}

async function proceedCheckout() {
  const resp = await fetch(`${API_URL}/checkout/payment`, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
  });
  return await checkResponse(resp);
}

// on production create the order using stripe webhooks
async function createOrder(products, amount, address) {
  const resp = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify({
      products: products.map(p => ({ productID: p.id, quantity: p.quantity })),
      amount,
      address
    }),
  });
  return await checkResponse(resp);
}

async function fetchAllOrders() {
  const userID = getUser()._id;
  const resp = await fetch(`${API_URL}/orders/user/${userID}`, {
    headers: {
      "x-access-token": getAccessToken(),
    }
  });
  return await checkResponse(resp);
}

async function fetchOrderDetails(orderID) {
  const resp = await fetch(`${API_URL}/orders/${orderID}`, {
    headers: {
      "x-access-token": getAccessToken(),
    }
  });
  return await checkResponse(resp);
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  fetchUserDetails,
  fetchProducts,
  fetchProduct,
  createUserCart,
  getUserCart,
  addProductsToCart,
  removeProductFromCart,
  patchCart,
  clearCart,
  proceedCheckout,
  createOrder,
  fetchAllOrders,
  fetchOrderDetails,
};