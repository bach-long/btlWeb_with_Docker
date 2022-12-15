import { Modal } from "antd";

export default function CustomModal({
  children,
  title,
  open,
  onCancel,
  onOk,
  width = "72%",
}) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="Lưu"
      cancelText="Bỏ qua"
      width={width}
    >
      {children}
    </Modal>
  );
}
