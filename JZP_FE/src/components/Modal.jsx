import "react";

// eslint-disable-next-line react/prop-types
function Modal({ onClose, message }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center">
        <p className="text-lg text-black font-bold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-customRed text-white px-4 py-2 rounded hover:bg-red-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default Modal;
