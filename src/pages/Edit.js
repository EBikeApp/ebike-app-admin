import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Upload,
  notification,
  message,
} from "antd";

import { Select } from "antd";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ProductContext } from "../store/product-context";
import { storage } from "../service/firebase/firebase";
import { Link } from "react-router-dom/cjs/react-router-dom";
import TextEditor from "../components/Editor/TextEditor";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const FormDisabledDemo = () => {
  let { state } = useLocation();
  const nameProductRef = useRef();
  const brandRef = useRef();
  const discountRef = useRef();
  const priceRef = useRef();
  const typeProductRef = useRef();
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateProduct } = useContext(ProductContext);
  const [productDescription, setProductDescription] = useState(
    state.description,
  );

  const [fileList, setFileList] = useState(
    state.thumbnail.map((item) => {
      return {
        uid: item,
        url: item,
        name: item,
        status: "done",
        thumbUrl: item,
      };
    }),
  );
  const [listUrl, setListUrl] = useState([...state.thumbnail]);
  const [imagesWillBeDeleted, setImagesWillBeDeleted] = useState([]);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      setFile(info.file);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
      });
    }
  };

  const uploadButton = (
    <div
      style={{
        border: "1px solid black",
        padding: "10px",
        borderRadius: "5px",
        margin: "0 center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
      </div>
      <div
        style={{
          marginTop: "8",
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleChangeSelectTypeProduct = (value) => {
    typeProductRef.current = value;
  };

  // useEffect(() => {
  //   setCurrentProducts(
  //     products
  //       .map((subObj) => subObj.products)
  //       .reduce((acc, cur) => acc.concat(cur), [])
  //   );
  // }, [products]);

  useEffect(() => {
    const uploadFile = () => {
      // const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          // setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log(downloadURL);
            openNotification("Thông báo", "Thêm ảnh thành công");
            setFileList([
              ...fileList,
              {
                uid: file.uid,
                url: downloadURL,
                name: file.name,
                status: "done",
                thumbUrl: downloadURL,
              },
            ]);
            setListUrl([...listUrl, downloadURL]);
            setLoading(false);
          });

          // uid: info.file.uid,
          // name: info.file.name,
          // status: "done",
          // url: url,
          // thumbUrl: url,
        },
      );
    };

    file && uploadFile();
  }, [file]);

  const openNotification = (title, message) => {
    notification.open({
      message: title,
      description: message,
    });
  };

  const handleOnClickForUpdateProduct = () => {
    updateProduct({
      id: state.id,
      type: typeProductRef.current ? typeProductRef.current : state.type,
      title: nameProductRef.current.input.value,
      brand:
        brandRef.current.input.value.charAt(0).toUpperCase() +
        brandRef.current.input.value.slice(1),
      discountPercentage: Number(discountRef.current.input.value),
      price: Number(priceRef.current.input.value),
      description: productDescription,
      thumbnail: [...listUrl],
    });
  };

  const onRemoveFile = (file) => {
    const newFileList = [...fileList].filter((item) => item.uid !== file.uid);
    setFileList([...newFileList]);
    setListUrl([...listUrl.filter((item) => item !== file.url)]);
    setImagesWillBeDeleted([...imagesWillBeDeleted, file.url]);
    // console.log(imagesWillBeDeleted);
  };

  // const onPreview = async (file) => {
  //   let src = file.url;
  //   if (!src) {
  //     src = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj);
  //       reader.onload = () => resolve(reader.result);
  //     });
  //   }
  // };

  // const actionUpload = (file) => {
  //   imageRef.current = file;
  //   console.log(imageRef.current);
  // };

  return (
    <>
      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item label="Phân Loại">
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={handleChangeSelectTypeProduct}
            // onSearch={onSearch}
            // filterOption={filterOption}
            options={[
              {
                value: "bicycle",
                label: "Xe đạp",
              },
              {
                value: "eBike",
                label: "Xe đạp điện",
              },
              {
                value: "eMotobike",
                label: "Xe máy điện",
              },
              {
                value: "fitting",
                label: "Phụ kiện",
              },
            ]}
            defaultValue={state.type}
          />
        </Form.Item>
        <Form.Item
          label="Tên Sản Phẩm"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Input ref={nameProductRef} defaultValue={state.title} />
        </Form.Item>
        <Form.Item
          label="Hãng"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Input ref={brandRef} defaultValue={state.brand} />
        </Form.Item>
        <Form.Item
          label="Giảm Giá"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Input
            type="number"
            ref={discountRef}
            min={0}
            max={100}
            defaultValue={state.discountPercentage}
          />
        </Form.Item>
        <Form.Item
          label="Giá Muốn Bán"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Input
            type="number"
            ref={priceRef}
            min={0}
            defaultValue={state.price}
          />
        </Form.Item>
        <Form.Item
          label="Hình Ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <Upload
            name="avatar"
            listType="picture"
            className="avatar-uploader"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            fileList={[...fileList]}
            onRemove={(file) => {
              onRemoveFile(file);
            }}
          >
            {uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          label="Mô Tả"
          rules={[
            {
              required: true,
              message: "Please input your task name!",
            },
          ]}
        >
          <TextEditor
            productDescription={productDescription}
            setProductDescription={setProductDescription}
          />
        </Form.Item>

        <Button
          type="primary"
          lType="submit"
          onClick={() => {
            handleOnClickForUpdateProduct();
          }}
        >
          Cập Nhập
        </Button>

        <Button>
          <Link to="/tables">Quay Lại</Link>
        </Button>
      </Form>
    </>
  );
};
export default () => <FormDisabledDemo />;
