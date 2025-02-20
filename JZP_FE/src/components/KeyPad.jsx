import PropTypes from "prop-types";

const Keypad = ({ onKeyPress, onDelete, onReset }) => {
  const keys = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ["초기화", 0, "⌫"],
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-3 gap-2 p-4 rounded-lg">
        {keys.flat().map((key, index) => (
          <button
            key={index}
            type="button"
            className={`w-16 aspect-square text-lg font-bold rounded-md flex items-center justify-center ${
              key === "초기화"
                ? "bg-keyPadGray text-sm"
                : key === "⌫"
                  ? "bg-deleteBlack text-2xl"
                  : "bg-keyPadGray"
            }`}
            onClick={() => {
              if (key === "초기화") onReset();
              else if (key === "⌫") onDelete();
              else onKeyPress(key);
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

Keypad.propTypes = {
  onKeyPress: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default Keypad;
