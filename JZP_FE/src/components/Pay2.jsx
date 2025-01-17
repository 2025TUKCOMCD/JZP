import "react";
import kakaopayIcon from "../assets/images/kakaopay.png"; // 카카오페이 아이콘 경로

function Pay() {
  const handleButtonClick = () => {
    alert("카카오페이 버튼이 클릭되었습니다!");
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={handleButtonClick}
        className="flex items-center bg-customYellow text-black px-6 py-6 rounded-lg font-semibold hover:opacity-90 transition duration-300"
        style={{ width: "380px" }} // 버튼 폭을 더 크게 설정
      >
        {/* 아이콘 */}
        <img
          src={kakaopayIcon}
          alt="카카오페이 아이콘"
          className="w-15 h-7 mr-6" // 아이콘 크기 및 오른쪽 여백 조정
        />
        {/* 아이콘 옆 텍스트 */}
        <span className="text-sm text-kakaoPayGray font-medium mr-auto">
          마음놓고 금융하다
        </span>
        {/* 오른쪽 끝 텍스트 */}
        <span className="text-[16px] font-semibold">카카오페이</span>
      </button>
    </div>
  );
}

export default Pay;
