import React, { useReducer, useEffect } from "react";
import {
  doc,
  getDocs,
  collection,
  addDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../service/firebase/firebase";
import { notification } from "antd";

const ProductContext = React.createContext({
  products: [],
  addProduct: (product) => {},
  removeProduct: (productId, productBrand) => {},
  updateProduct: (productId, productBrand) => {},
});

const actions = {
  ADD_PRODUCT: "ADD_PRODUCT",
  REMOVE_PRODUCT: "REMOVE_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  GET_DATA_FROM_DATABASE: "GET_DATA_FROM_DATABASE",
};

const openNotification = (title, message) => {
  notification.open({
    message: title,
    description: message,
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.ADD_PRODUCT: {
      const product = { ...action.payload };
      const newProducts = [...state.products];

      const addProduct = async (product) => {
        await addDoc(collection(db, "products"), {
          id: product.id,
          brand: product.brand,
          discountPercentage: product.discountPercentage,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          description: product.description,
          type: product.type,
        })
          .then(() => {
            openNotification("Thêm thành công", "");
          })
          .catch((error) => {
            openNotification(
              "Thêm thất bại",
              "Mời bạn reload lại page để thêm",
            );
          });

        return product;
      };
      addProduct(product).then(console.log("Thêm thành công"));
      return { ...state, products: [...newProducts, product] };
    }

    case actions.REMOVE_PRODUCT: {
      const productId = action.payload;
      const newProducts = [...state.products];
      const removeProduct = async (productId) => {
        const q = query(
          collection(db, "products"),
          where("id", "==", productId),
        );

        const querySnapshot = await getDocs(q);
        const docRef = doc(db, "products", querySnapshot.docs[0].id);
        deleteDoc(docRef);
      };
      removeProduct(productId)
        .then(() => {
          openNotification("Xóa thành công", "");
        })
        .catch((error) => {
          openNotification("Xóa thất bại", "Mời bạn reload lại page để xóa");
        });

      return {
        ...state,
        products: newProducts.filter((item) => item.id !== productId),
      };
    }

    case actions.UPDATE_PRODUCT: {
      const product = { ...action.payload };
      const newProducts = [...state.products];
      const updateProduct = async (product) => {
        const q = query(
          collection(db, "products"),
          where("id", "==", product.id),
        );

        const querySnapshot = await getDocs(q);
        const docRef = doc(db, "products", querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          ...product,
        });
        return querySnapshot.docs[0].data();
      };
      updateProduct(product)
        .then((data) => {
          openNotification("Cập nhật thành công", "");
        })
        .catch((error) => {
          openNotification(
            "Cập nhật thất bại",
            "Mời bạn reload lại page để cập nhật",
          );
        });

      return {
        ...state,
        products: [
          ...newProducts.map((item) => {
            if (item.id === product.id) {
              return product;
            }
            return item;
          }),
        ],
      };
    }

    case actions.GET_DATA_FROM_DATABASE: {
      return { ...state, products: action.payload };
    }

    default: {
      return state;
    }
  }
};

const ProductProvider = ({ children }) => {
  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    };
    getData().then((data) => {
      // console.log(data);
      getDataFromDatabase(data);
    });
  }, []);
  const [state, dispatch] = useReducer(reducer, {
    products: [],
  });

  const addProduct = (product) => {
    dispatch({ type: actions.ADD_PRODUCT, payload: product });
  };

  const removeProduct = (productId) => {
    dispatch({
      type: actions.REMOVE_PRODUCT,
      payload: productId,
    });
  };

  const updateProduct = (product) => {
    dispatch({
      type: actions.UPDATE_PRODUCT,
      payload: { ...product },
    });
  };

  const getDataFromDatabase = (products) => {
    dispatch({
      type: actions.GET_DATA_FROM_DATABASE,
      payload: products,
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        addProduct: addProduct,
        removeProduct: removeProduct,
        updateProduct: updateProduct,
        getDataFromDatabase: getDataFromDatabase,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
export { ProductContext };
