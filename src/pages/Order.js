import { numberToVND } from "../utils/common";
import {
  Row,
  Col,
  Card,
  Table,
  // message,
  // Button,
  Typography,
  Image,
  // Dropdown,
  // Space,
  List,
  Button,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import { OrderFromCustomerContext } from "../store/order-from-customer-context";

// import { DownOutlined } from "@ant-design/icons";

const { Title } = Typography;

const columns = [
  {
    title: "TÊN KHÁCH HÀNG",
    dataIndex: "customerName",
    key: "customerName",
    width: "40%",
    fixed: "left",
  },
  {
    title: "SỐ ĐIỆN THOẠI",
    dataIndex: "customerNumberPhone",
    key: "customerNumberPhone",
  },

  {
    title: "ĐƠN HÀNG",
    key: "products",
    dataIndex: "products",
  },
  {
    title: "TỔNG TIỀN",
    key: "total",
    dataIndex: "total",
  },
  {
    title: "THAO TÁC",
    key: "action",
    dataIndex: "action",
    fixed: "right",
    width: 100,
  },
];

const Order = () => {
  const { orderFromCustomer, removeOrderFromCustomer } = useContext(
    OrderFromCustomerContext
  );

  const data = orderFromCustomer.map((order) => {
    return {
      key: order.id,
      customerName: (
        <>
          <Title level={5}>{order.customerName}</Title>
        </>
      ),
      customerNumberPhone: (
        <>
          <div className="ant-brand">
            <span>{order.customerNumberPhone}</span>
          </div>
        </>
      ),

      products: (
        <>
          <List
            // grid={{ column: 3, gutter: 16 }}
            dataSource={[...order.products]}
            renderItem={(product, index) => {
              return (
                <List.Item>
                  <div>
                    <Title level={5}>Tên: {product.name}</Title>
                    <Title level={5}>Giá: {numberToVND(product.price)}</Title>
                    <Title level={5}>Số lượng: {product.quantity}</Title>
                  </div>
                  <div style={{ width: "20%" }}>
                    <Image
                      src={product.image}
                      style={{ borderRadius: "10px", width: "100%" }}
                    />
                  </div>
                </List.Item>
              );
            }}
          />
        </>
      ),
      total: (
        <>
          <Title level={5}>{numberToVND(order.total)}</Title>
        </>
      ),
      action: (
        <Button onClick={() => removeOrderFromCustomer(order.id)}>
          Xóa <DeleteOutlined />
        </Button>
      ),
    };
  });

  // const handleMenuClick = useCallback((e) => {
  //   console.log(e);
  //   const selected = items.find((item) => item.key === e.key);
  //   setSelectedType(selected);
  // });

  // const menuProps = {
  //   onClick: handleMenuClick,
  //   items,
  // };

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Bảng sản phẩm"
              // extra={
              //   <>
              //     <Dropdown menu={menuProps}>
              //       <Button>
              //         <Space>
              //           {selectedType.label} <DownOutlined />
              //         </Space>
              //       </Button>
              //     </Dropdown>
              //   </>
              // }
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

export default Order;
