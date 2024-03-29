import {
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import indexApi from "../../../../apis";

export default function VersionForm({ form, errorPanelKey, versionId }) {
  const [allModels, setAllModels] = useState([]);
  const [initialValues, setInitialValues] = useState(versionId ? null : {});
  const [selectedPanelKey, setSelectedPanelKey] = useState([
    "size",
    "engine",
    "chassis",
    "exterior",
    "interior",
    "safety",
    "i_activsense",
  ]);

  useEffect(() => {
    if (versionId) {
      getVersionById();
    }
  }, [versionId]);

  useEffect(() => {
    if (errorPanelKey) {
      setSelectedPanelKey((prev) => [...prev, errorPanelKey]);
    }
  }, [errorPanelKey]);

  const getVersionById = async () => {
    const res = await indexApi.getVersionById(versionId);

    if (res.success) {
      const data = res.data;
      setInitialValues(data);
      form.setFieldValue("model_id", data.model_id);
      form.setFieldValue("name", data.name);
      form.setFieldValue("size", data.size);
      form.setFieldValue(
        ["size", "kich_thuoc_tong_the", "length"],
        data.size.kich_thuoc_tong_the.split(" x ")[0]
      );
      form.setFieldValue(
        ["size", "kich_thuoc_tong_the", "width"],
        data.size.kich_thuoc_tong_the.split(" x ")[1]
      );
      form.setFieldValue(
        ["size", "kich_thuoc_tong_the", "height"],
        data.size.kich_thuoc_tong_the.split(" x ")[2]
      );
      form.setFieldValue("engine", data.engine);
      form.setFieldValue("chassis", data.chassis);
      form.setFieldValue("exterior", data.exterior);
      form.setFieldValue("interior", data.interior);
      form.setFieldValue("safety", data.safety);
      form.setFieldValue("i_activesense", data.i_activesense);
    }
  };

  const handleChange = (selectedPanelKey) => {
    setSelectedPanelKey(selectedPanelKey);
  };

  useEffect(() => {
    getAllModels();

    return () => {
      form.resetFields();
    };
  }, []);

  const getAllModels = async () => {
    const res = await indexApi.getAllModels();
    if (res.success) {
      setAllModels(res.data.models);
    }
  };
  return (
    <Spin spinning={!initialValues && versionId}>
      {initialValues && (
        <Form
          labelCol={{ sm: 6, md: 4 }}
          style={{ paddingTop: 24, paddingBottom: 24, overflowY: "auto" }}
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Dòng sản phẩm"
            required
            name="model_id"
            rules={[
              { required: true, message: "Không được bỏ trống" },
              {
                type: "number",
                min: 1,
                max:
                  allModels && allModels.length > 0
                    ? allModels[allModels.length - 1].id
                    : 10000,
                message: "Giá trị không phù hợp",
              },
            ]}
          >
            <Select
              placeholder="Chọn dòng sản phẩm"
              options={allModels.map((model) => {
                return {
                  value: model.id,
                  label: model.name,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            label="Phiên bản"
            required
            name="name"
            rules={[
              { required: true, message: "Không được bỏ trống" },
              {
                type: "string",
                min: 1,
                max: 200,
              },
            ]}
          >
            <Input placeholder="Nhập tên phiên bản" />
          </Form.Item>
          <Form.Item label="Thông số" required>
            <Collapse
              onChange={handleChange}
              bordered
              ghost
              activeKey={selectedPanelKey}
            >
              <Collapse.Panel header="Kích thước - Khối lượng" key="size">
                <Form.Item
                  label="Kích thước tổng thể"
                  required
                  style={{ margin: 0 }}
                >
                  <Space size={[24, 0]}>
                    <Form.Item
                      name={["size", "kich_thuoc_tong_the", "length"]}
                      required
                      rules={[
                        { required: true, message: "Không được bỏ trống" },
                      ]}
                    >
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        placeholder="Nhập chiều dài"
                        style={{ width: "100%" }}
                        min={0}
                        max={1000000}
                      />
                    </Form.Item>
                    <Form.Item
                      name={["size", "kich_thuoc_tong_the", "width"]}
                      required
                      rules={[
                        { required: true, message: "Không được bỏ trống" },
                      ]}
                    >
                      <InputNumber
                        placeholder="Nhập chiều rộng"
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        max={1000000}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      name={["size", "kich_thuoc_tong_the", "height"]}
                      required
                      rules={[
                        { required: true, message: "Không được bỏ trống" },
                      ]}
                    >
                      <InputNumber
                        placeholder="Nhập chiều cao"
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        max={1000000}
                        min={0}
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>
                <Form.Item
                  labelCol={{ sm: { span: 12 }, md: { span: 10 } }}
                  label="Chiều dài cơ sở"
                  required
                  name={["size", "chieu_dai_co_so"]}
                  rules={[{ required: true, message: "Không được bỏ trống" }]}
                >
                  <InputNumber
                    placeholder="Nhập chiều dài cơ sở"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    max={1000000}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ sm: { span: 12 }, md: { span: 10 } }}
                  label="Bán kính vòng quay tối thiểu"
                  labelWrap
                  required
                  name={["size", "ban_kinh_quay_vong_toi_thieu"]}
                  rules={[{ required: true, message: "Không được bỏ trống" }]}
                >
                  <InputNumber
                    placeholder="Nhập bán kính"
                    style={{ width: "100%" }}
                    max={1000000}
                    min={0}
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ sm: { span: 12 }, md: { span: 10 } }}
                  label="Khoảng sáng gầm xe"
                  labelWrap
                  required
                  name={["size", "khoang_sang_gam_xe"]}
                  rules={[{ required: true, message: "Không được bỏ trống" }]}
                >
                  <InputNumber
                    placeholder="Nhập khoảng sáng"
                    style={{ width: "100%" }}
                    min={1}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    max={1000000}
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ sm: { span: 12 }, md: { span: 10 } }}
                  label="Khối lượng không tải"
                  labelWrap
                  required
                  name={["size", "khoi_luong_khong_tai"]}
                  rules={[{ required: true, message: "Không được bỏ trống" }]}
                >
                  <InputNumber
                    placeholder="Nhập khối lượng"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ sm: { span: 12 }, md: { span: 10 } }}
                  label="Khối lượng toàn tải"
                  labelWrap
                  required
                  name={["size", "khoi_luong_toan_tai"]}
                  rules={[{ required: true, message: "Không được bỏ trống" }]}
                >
                  <InputNumber
                    placeholder="Nhập khối lượng"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    min={0}
                    max={1000000}
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ sm: { span: 12 }, md: { span: 10 } }}
                  label="Thể tích khoang hành lý"
                  labelWrap
                  required
                  name={["size", "the_tich_khoang_hanh_ly"]}
                  rules={[{ required: true, message: "Không được bỏ trống" }]}
                >
                  <InputNumber
                    placeholder="Nhập thể tích"
                    style={{ width: "100%" }}
                    min={0}
                    max={1000000}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <Form.Item
                  labelCol={{ sm: { span: 12 }, md: { span: 10 } }}
                  label="Dung tích thùng nhiên liệu"
                  labelWrap
                  required
                  name={["size", "dung_tich_thung_nhien_lieu"]}
                  rules={[{ required: true, message: "Không được bỏ trống" }]}
                >
                  <InputNumber
                    placeholder="Nhập dung tích"
                    style={{ width: "100%" }}
                    min={0}
                    max={1000000}
                  />
                </Form.Item>
              </Collapse.Panel>
              <Collapse.Panel header="Động cơ hộp số" key="engine">
                <SpecificationFormItem
                  label="Loại động cơ"
                  name={["engine", "loai_dong_co"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập loại động cơ" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống nhiên liệu"
                  name={["engine", "he_thong_nhien_lieu"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập hệ thống nhiên liệu" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Dung tích xi lanh"
                  name={["engine", "dung_tich_xilanh"]}
                  isRule={true}
                >
                  <InputNumber
                    placeholder="Nhập dung tích"
                    style={{ width: "100%" }}
                    min={0}
                    max={1000000}
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Công suất tối đa"
                  name={["engine", "cong_suat_toi_da"]}
                  isRule={true}
                >
                  <InputNumber
                    placeholder="Nhập công suất"
                    style={{ width: "100%" }}
                    min={0}
                    max={1000000}
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Momen xoắn cực đại"
                  name={["engine", "momen_xoan_cuc_dai"]}
                  isRule={true}
                >
                  <InputNumber
                    placeholder="Nhập giá trị mô men xoắn"
                    style={{ width: "100%" }}
                    min={0}
                    max={1000000}
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hộp số"
                  name={["engine", "hop_so"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập hộp số" min={0} max={1000000} />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Chế độ thể thao"
                  name={["engine", "che_do_the_thao"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.engine?.che_do_the_thao === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống kiểm soát gia tốc (GVC)"
                  name={["engine", "GVC"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập GVC" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống ngừng/khởi động thông minh"
                  name={["engine", "he_thong_ngung_khoi_dong_thong_minh"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.engine
                        ?.he_thong_ngung_khoi_dong_thong_minh === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
              </Collapse.Panel>
              <Collapse.Panel header="Khung gầm" key="chassis">
                <SpecificationFormItem
                  label="Hệ thống treo trước"
                  name={["chassis", "he_thong_treo_truoc"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập hệ thống" />
                </SpecificationFormItem>

                <SpecificationFormItem
                  label="Hệ thống treo sau"
                  name={["chassis", "he_thong_treo_sau"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập hệ thống" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống dẫn động"
                  name={["chassis", "he_thong_dan_dong"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập hệ thống" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống phanh trước"
                  name={["chassis", "he_thong_phanh_truoc"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập hệ thống" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống phanh sau"
                  name={["chassis", "he_thong_phanh_sau"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập hệ thống" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống trợ lực lái"
                  name={["chassis", "he_thong_tro_luc_lai"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập hệ thống" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Kích thước lốp xe"
                  name={["chassis", "kich_thuoc_lop_xe"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập hệ thống" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Đường kính lốp xe"
                  name={["chassis", "duong_kinh_mam_xe"]}
                  isRule={true}
                >
                  <Input placeholder="Nhập đường kính" />
                </SpecificationFormItem>
              </Collapse.Panel>
              <Collapse.Panel header="Ngoại thất" key="exterior">
                <SpecificationFormItem
                  name={["exterior", "den_chieu_gan"]}
                  label="Đèn chiếu gần"
                  isRule={true}
                >
                  <Input placeholder="Nhập đèn" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["exterior", "den_chieu_xa"]}
                  label="Đèn chiếu xa"
                  isRule={true}
                >
                  <Input placeholder="Nhập đèn" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["exterior", "den_led_chay_ban_ngay"]}
                  label="Đèn LED chạy ban ngày"
                  valuePropName="checked"
                  initialValue={
                    initialValues?.exterior?.den_led_chay_ban_ngay === "yes"
                  }
                >
                  <Switch
                    defaultChecked={
                      initialValues?.exterior?.den_led_chay_ban_ngay === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["exterior", "den_truoc_tu_dong_bat_tat"]}
                  label="Đèn trước tự động Bật/Tắt"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.exterior?.den_truoc_tu_dong_bat_tat ===
                      "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["exterior", "den_truoc_tu_dong_can_bang_goc_chieu"]}
                  label="Đèn trước tự động cân bằng góc chiếu"
                >
                  <Switch
                    defaultChecked={false}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={[
                    "exterior",
                    "guong_chieu_hau_ngoai_gap_dien_chinh_dien",
                  ]}
                  label="Gương chiếu hậu ngoài điều chỉnh chập điệu/chỉnh điện"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.exterior
                        ?.guong_chieu_hau_ngoai_gap_dien_chinh_dien === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["exterior", "gat_mua_tu_dong"]}
                  label="Chức năng gạt mưa tự động"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.exterior?.gat_mua_tu_dong === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["exterior", "cum_den_sau_dang_led"]}
                  label="Cụm đèn sau dạng LED"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.exterior?.cum_den_sau_dang_led === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["exterior", "cua_so_troi"]}
                  label="Cửa sổ trời"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.exterior?.cua_so_troi === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["exterior", "ong_xa_kep"]}
                  label="Ống xả kép"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.exterior?.ong_xa_kep === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
              </Collapse.Panel>
              <Collapse.Panel header="Nội thất" key="interior">
                <SpecificationFormItem
                  name={["interior", "chat_lieu_noi_that"]}
                  label="Chất liệu nội thất"
                  isRule={true}
                >
                  <Input placeholder="Nhập chất liệu" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "ghe_lai_dieu_chinh_dien"]}
                  label="Ghế lái điều chỉnh điện"
                >
                  <Switch
                    defaultChecked={() => {
                      return (
                        initialValues?.interior?.ghe_lai_dieu_chinh_dien ===
                        "yes"
                      );
                    }}
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "ghe_lai_co_nho_vi_tri"]}
                  label="Ghế lái có nhớ vị trí"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.ghe_lai_co_nho_vi_tri === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "ghe_phu_dieu_chinh_dien"]}
                  label="Ghế phụ điều chỉnh điện"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.ghe_phu_dieu_chinh_dien === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "dvd_player"]}
                  label="DVD player"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.dvd_player === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "man_hinh_cam_ung"]}
                  label="Màn hình cảm ứng"
                  isRule={true}
                >
                  <Input placeholder="Nhập hệ thống" />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "AUX_USB_bluetooth"]}
                  label="Kết nối AUX, USB, bluetooth"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.AUX_USB_bluetooth === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "so_loa"]}
                  label="Số loa"
                  isRule={true}
                >
                  <InputNumber
                    placeholder="Nhập số lượng"
                    style={{ width: "100%" }}
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "lay_chuyen_so"]}
                  label="Lẫy chuyển số"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.lay_chuyen_so === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "phanh_tay_dien_tu"]}
                  label="Phanh điện tử"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.phanh_tay_dien_tu === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "giu_phanh_tu_dong"]}
                  label="Giữ phanh tự động"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.giu_phanh_tu_dong === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "khoi_dong_bang_nut_bam"]}
                  label="Khởi động bằng nút bấm"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.khoi_dong_bang_nut_bam === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "ga_tu_dong"]}
                  label="Ga tự động"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.ga_tu_dong === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "dieu_hoa_tu_dong"]}
                  label="Điều hòa tự động"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.dieu_hoa_tu_dong === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "cua_gio_hang_ghe_sau"]}
                  label="Cửa gió hàng ghế sau"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.cua_gio_hang_ghe_sau === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "cua_so_chinh_dien"]}
                  label="Cửa sổ chỉnh điện"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.cua_so_chinh_dien === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "guong_hau_trung_tam_chong_choi_tu_dong"]}
                  label="Gương chiếu hậu trung tâm chống chói tự động"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior
                        ?.guong_hau_trung_tam_chong_choi_tu_dong === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "hud"]}
                  label="Màn hình hiển thị tốc độ HUD"
                >
                  <Switch
                    defaultChecked={initialValues?.interior?.hub === "yes"}
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "rem_che_nang_kinh_sau_chinh_dien"]}
                  label="Rèm che nắng kính sau chỉnh điện"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior
                        ?.rem_che_nang_kinh_sau_chinh_dien === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "rem_che_nang_cua_so_sau"]}
                  label="Rèm che nắng cửa sổ hàng ghế sau"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.rem_che_nang_cua_so_sau === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "tua_tay_hang_ghe_sau"]}
                  label="Tựa tay hàng ghế sau"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior?.tua_tay_hang_ghe_sau === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "tua_tay_ghe_sau_tich_hop_cong_usb"]}
                  label="Tựa tay ghế sau tích hợp cổng USB"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior
                        ?.tua_tay_ghe_sau_tich_hop_cong_usb === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  name={["interior", "hang_ghe_thu_hai_gap_theo_ti_le_60_40"]}
                  label="Hàng ghế thứ hai gập theo tỉ lệ 60:40"
                >
                  <Switch
                    defaultChecked={
                      initialValues?.interior
                        ?.hang_ghe_thu_hai_gap_theo_ti_le_60_40 === "yes"
                    }
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
                </SpecificationFormItem>
              </Collapse.Panel>
              <Collapse.Panel header="An toàn" key="safety">
                <SpecificationFormItem
                  label="Số túi khí"
                  name={["safety", "so_tui_khi"]}
                >
                  <Switch
                    defaultChecked={initialValues?.safety?.so_tui_khi === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống chống bó cứng phanh ABS"
                  name={["safety", "ABS"]}
                >
                  <Switch
                    defaultChecked={initialValues?.safety?.ABS === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống phân bổ lực phanh điện tử EBD"
                  name={["safety", "EBD"]}
                >
                  <Switch
                    defaultChecked={initialValues?.safety?.EBD === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống hỗ trợ lực phanh khẩn cấp EBA"
                  name={["safety", "EBA"]}
                >
                  <Switch
                    defaultChecked={initialValues?.safety?.EBA === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống cảnh báo phanh khẩn cấp ESS"
                  name={["safety", "ESS"]}
                >
                  <Switch
                    defaultChecked={initialValues?.safety?.ESS === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống cân bằng điện tử DSC"
                  name={["safety", "DSC"]}
                >
                  <Switch
                    defaultChecked={initialValues?.safety?.DSC === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống kiểm soát lực kéo chống trượt TCS"
                  name={["safety", "TCS"]}
                >
                  <Switch
                    defaultChecked={initialValues?.safety?.TCS === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống hỗ trợ khởi hành ngang dốc HLA"
                  name={["safety", "HLA"]}
                >
                  <Switch
                    defaultChecked={initialValues?.safety?.HLA === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Mã hóa chống sao chép chìa khóa"
                  name={["safety", "ma_hoa_chong_sao_chep_chia_khoa"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.safety?.ma_hoa_chong_sao_chep_chia_khoa ===
                      "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Cảnh báo chống trộm"
                  name={["safety", "canh_bao_chong_trom"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.safety?.canh_bao_chong_trom === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Camera lùi"
                  name={["safety", "camera_lui"]}
                >
                  <Switch
                    defaultChecked={initialValues?.safety?.camera_lui === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Cảm biến cảnh báo va chạm phía sau"
                  name={["safety", "cam_bien_canh_bao_va_cham_phia_sau"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.safety
                        ?.cam_bien_canh_bao_va_cham_phia_sau === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Cảm biến cảnh báo va chạm phía trước"
                  name={["safety", "cam_bien_canh_bao_va_cham_phia_truoc"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.safety
                        ?.cam_bien_canh_bao_va_cham_phia_truoc === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Camera quan sát 360 độ"
                  name={["safety", "camera_quan_sat_360"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.safety?.camera_quan_sat_360 === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Cảnh báo thắt dây an toàn"
                  name={["safety", "canh_bao_that_day_an_toan"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.safety?.canh_bao_that_day_an_toan === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
              </Collapse.Panel>
              <Collapse.Panel header="i_activsense" key="i_activsense">
                <SpecificationFormItem
                  label="Hệ thống mở rộng góc chiếu đèn trước theo hướng đánh lái AFS"
                  name={["i_activsense", "AFS"]}
                >
                  <Switch
                    defaultChecked={initialValues?.i_activesense?.AFS === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống tự động điều chỉnh chế độ đèn chiếu xa HBC"
                  name={["i_activsense", "HBC"]}
                >
                  <Switch
                    defaultChecked={initialValues?.i_activesense?.HBC === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống đèn thích ứng thông minh ALH"
                  name={["i_activsense", "ALH"]}
                >
                  <Switch
                    defaultChecked={initialValues?.i_activesense?.ALH === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Cảnh báo phương tiện cắt ngang khi lùi RCTA"
                  name={["i_activsense", "RCTA"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.i_activesense?.RCTA === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Cảnh báo chệch làn LDW"
                  name={["i_activsense", "LDW"]}
                >
                  <Switch
                    defaultChecked={initialValues?.i_activesense?.LDW === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hỗ trợ giữ làn LAS"
                  name={["i_activsense", "LAS"]}
                >
                  <Switch
                    defaultChecked={initialValues?.i_activesense?.LAS === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hỗ trợ phanh thông minh trong thành phố (phía trước)"
                  name={["i_activsense", "phanh_thong_mminh_truoc"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.i_activesense?.phanh_thong_mminh_truoc ===
                      "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hỗ trợ phanh thông minh trong thành phố (phía sau)"
                  name={["i_activsense", "phanh_thong_minh_sau"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.i_activesense?.phanh_thong_minh_sau ===
                      "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hỗ trợ phanh thông minh SBS"
                  name={["i_activsense", "SBS"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.i_activesense
                        ?.tua_tay_ghe_sau_tich_hop_cong_usb === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống điều khiển hành trình tích hợp radar MRCC"
                  name={["i_activsense", "MRCC"]}
                >
                  <Switch
                    defaultChecked={
                      initialValues?.i_activesense?.MRCC === "yes"
                    }
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống nhắc nhở người lái tập trung DAA"
                  name={["i_activsense", "DAA"]}
                >
                  <Switch
                    defaultChecked={initialValues?.i_activesense?.DAA === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
                <SpecificationFormItem
                  label="Hệ thống cảnh báo điểm mù BSM"
                  name={["i_activsense", "BSM"]}
                >
                  <Switch
                    defaultChecked={initialValues?.i_activesense?.BSM === "yes"}
                    unCheckedChildren="Không"
                    checkedChildren="Có"
                  />
                </SpecificationFormItem>
              </Collapse.Panel>
            </Collapse>
          </Form.Item>
        </Form>
      )}
    </Spin>
  );
}

function SpecificationFormItem({
  children,
  label,
  name,
  valuePropName,
  initialValue,
  isRule = false,
}) {
  return (
    <Form.Item
      label={label}
      labelWrap
      required
      name={[...name]}
      valuePropName={valuePropName}
      initialValue={initialValue}
      rules={
        isRule === true
          ? [{ required: true, message: "Không được bỏ trống" }]
          : []
      }
    >
      {children}
    </Form.Item>
  );
}
