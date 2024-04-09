import { numberToVND } from "../utils/common";
import {
  Row,
  Col,
  Card,
  // Radio,
  Table,
  // Upload,
  // message,
  // Progress,
  Button,
  // Avatar,
  Typography,
  Image,
  Dropdown,
  Space,
  List,
  Flex,
} from "antd";
import { ProductContext } from "../store/product-context";
import React, { useCallback, useContext, useEffect } from "react";

import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

const columns = [
  {
    title: "TÊN SẢN PHẨM",
    dataIndex: "name",
    key: "name",
    width: "40%",
    fixed: "left",
  },
  {
    title: "HÃNG",
    dataIndex: "brand",
    key: "brand",
  },

  {
    title: "GIẢM GIÁ (MARKETING)",
    key: "discountPercentage",
    dataIndex: "discountPercentage",
  },

  {
    title: "GIÁ MUỐN BÁN",
    key: "originalPrice",
    dataIndex: "originalPrice",
  },

  {
    title: "HÌNH ẢNH",
    key: "thumbnail",
    dataIndex: "thumbnail",
  },
  // {
  //   title: "MÔ TẢ",
  //   key: "description",
  //   dataIndex: "description",
  // },
  {
    title: "CHỈNH SỬA",
    key: "edit",
    dataIndex: "edit",
    fixed: "right",
    // width: 100,
    // render: () => <a>action</a>,
  },
];

const Tables = () => {
  const [currentData, setCurrentData] = React.useState([]);
  const [selectedType, setSelectedType] = React.useState({
    label: "All",
    key: "all",
  });
  // const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  const { products, removeProduct } = useContext(ProductContext);

  useEffect(() => {
    console.log(products);
  }, []);

  useEffect(() => {
    if (selectedType.key === "all") {
      setCurrentData(products);
    } else {
      const currentData = products.filter(
        (item) => item.type === selectedType.key,
      );
      setCurrentData(currentData);
    }
  }, [selectedType.key, products]);

  const data = currentData.map((product) => {
    return {
      key: product.id,
      name: (
        <>
          <Title level={5}>{product.title}</Title>
        </>
      ),
      brand: (
        <>
          <div className="ant-brand">
            <span>{product.brand}</span>
          </div>
        </>
      ),
      thumbnail: (
        <div style={{ width: "20%" }}>
          <div
            style={{
              display: "flex",
              // flex wrap
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {product.thumbnail.map((item, index) => {
              return (
                <Image
                  key={index}
                  src={item}
                  style={{ borderRadius: "10px", width: "100%" }}
                />
              );
            })}
          </div>
        </div>
      ),
      discountPercentage: <span>{product.discountPercentage}</span>,
      originalPrice: <span>{numberToVND(product.price)}</span>,
      // description: <div className="ant-description">{product.description}</div>,
      edit: (
        <>
          <Button>
            <Link
              to={{
                pathname: `/edit/${product.id}`,
                state: {
                  ...product,
                },
              }}
            >
              Chỉnh sửa
            </Link>
          </Button>
          <Button
            onClick={() => {
              removeProduct(product.id);
            }}
          >
            Xóa
          </Button>
        </>
      ),
      // edit: (
      //   <>
      //     <Button
      //       onClick={() =>
      //         console.log({
      //           ...product,
      //         })
      //       }
      //     ></Button>
      //   </>
      // ),
    };
  });

  const items = [
    {
      label: "All",
      key: "all",
    },
    {
      label: "Xe đạp",
      key: "bicycle",
    },
    {
      label: "Xe điện",
      key: "eBike",
    },
    {
      label: "Xe máy điện",
      key: "eMotobike",
    },
    {
      label: "Phụ kiện",
      key: "fitting",
    },
  ];

  const handleMenuClick = useCallback((e) => {
    console.log(e);
    const selected = items.find((item) => item.key === e.key);
    setSelectedType(selected);
  });

  const menuProps = {
    onClick: handleMenuClick,
    items,
  };

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Bảng sản phẩm"
              extra={
                <>
                  <Dropdown menu={menuProps}>
                    <Button>
                      <Space>
                        {selectedType.label} <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </>
              }
            >
              <div className="table-responsive">
                <Table
                  bordered={true}
                  columns={columns}
                  dataSource={data}
                  className="ant-border-space"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Tables;
