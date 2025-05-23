import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const Modal = ({ isOpen, onRequestClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: "#00000040",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          maxWidth: "90%",
          maxHeight: "90%",
          position: "relative",
          inset: "0",
          backgroundColor: "white",
          border: "none",
          boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.2)",
          boxSizing: "border-box",
        },
      }}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
