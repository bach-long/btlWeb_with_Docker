import React, { useState, useEffect, useContext } from "react";
import { Modal, Row, Col, Select, Button } from "antd";
import { Input } from "antd";
import styled from "styled-components";
import indexApi from "../../../apis/index";
import { AuthContext } from "../../../Provider/AuthProvider";
import { sendWarrantService } from "../../../apis/store";
const { TextArea } = Input;

const ModelSendWarranty = (props) => {
  const [product, setProduct] = useState({});
  const [warranties, setWarranties] = useState([]);
  const [warranty, setWarranty] = useState(0);
  const { authUser } = useContext(AuthContext);
  const [errContent, setErrorContent] = useState("");

  const onSearch = (value) => {
    console.log("search:", value);
  };

  useEffect(() => {
    if (props.idProductWarranty) {
      getProduct(props.idProductWarranty);
    }
  }, [props.idProductWarranty]);

  const getProduct = async (id) => {
    const res = await indexApi.getProductById(id);
    if (res.data) {
      setProduct(res.data);
    }
  };
  useEffect(() => {
    getWarranties();
  }, []);

  const getWarranties = async () => {
    const res = await indexApi.getManagerByRole(3);
    if (res.data) {
      setWarranties(buildDataModel(res.data));
    }
  };

  const buildDataModel = (data) => {
    const results = new Array();
    for (let i = 0; i < data.length; i++) {
      results.push({ value: data[i].id, label: data[i].name });
    }
    return results;
  };

  const onChangeWarranty = (value) => {
    setWarranty(value);
  };

  const sendWarrant = async () => {
    console.log(warranty);
    console.log(errContent);
    console.log(props.idProductWarranty);

    if (
      warranty !== 0 &&
      props.idProductWarranty > 0 &&
      errContent.length > 0
    ) {
      const res = await sendWarrantService({
        product_id: props.idProductWarranty,
        store_id: authUser.id,
        content: errContent,
      });
      if (res.success === true) {
        setWarranty(0);
        props.handleOk();
      }
    }
  };
  return (
    <Modal
      title="Yêu cầu bảo hành"
      open={props.isModalOpen}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
      width={880}
      footer={[]}
      centered={true}
    >
      <hr style={{ margin: 0, color: "gray" }} />
      <Col span={12} style={{ paddingTop: 20 }}>
        <BoldText style={{ textTransform: "uppercase" }}>
          Thông tin Sản phẩm
        </BoldText>
        <Col style={{ marginLeft: 5 }}>
          <Row
            style={{
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "14px",
              paddingBottom: "0",
              marginBottom: "0px",
              height: "17px",
            }}
          >
            {product?.version?.name}
          </Row>
          <Row
            style={{
              fontSize: "12px",
              paddingBottom: "0",
              marginBottom: "2px",
              fontStyle: "italic",
              color: "gray",
              textTransform: "capitalize",
            }}
          >
            {product?.model?.name}
          </Row>

          <Row>
            <BoldText>Cơ sở sản xuất: </BoldText>
            <DesText>
              {" " + product && product.managers && product.managers.length > 0
                ? product?.managers[0]?.name
                : null}
            </DesText>
          </Row>

          <Row>
            <BoldText>Mã UUID:</BoldText>
            <DesText>{" " + product?.uuid}</DesText>
          </Row>

          <Row>
            <BoldText>Thời gian bảo hành:</BoldText>
            <DesText>{" " + product?.maintain_month + " Tháng"}</DesText>
          </Row>
          <Row>
            <BoldText>Trạng thái: </BoldText>
            <DesText>{" " + product?.status?.context}</DesText>
          </Row>
        </Col>
      </Col>
      <Row gutter={[8, 8]} style={{ paddingTop: 20 }}>
        <BoldText style={{ textTransform: "uppercase" }}>
          Thông tin chi tiết bảo hành
        </BoldText>

        <Col span={24}>
          <label>Cơ sở bảo hành: </label>
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChangeWarranty}
            style={{
              width: "100%",
            }}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={warranties}
          />
        </Col>

        <Col span={24}>
          <label>Mô tả lỗi: </label>
          <TextArea
            autoSize={{
              minRows: 4,
              maxRows: 6,
            }}
            style={{ width: "100%" }}
            placeholder="Mô tả lỗi bạn gặp phải tại đây"
            onChange={(e) => setErrorContent(e.target.value)}
          ></TextArea>
        </Col>
      </Row>

      <Row style={{ paddingTop: 20 }}>
        <Button type="primary" onClick={() => sendWarrant()}>
          Gửi yêu cầu
        </Button>
      </Row>
    </Modal>
  );
};

export default ModelSendWarranty;
const BoldText = styled(Row)`
  font-weight: bold;
`;

const DesText = styled(Row)`
  text-transform: capitalize;
  padding-left: 5px;
`;