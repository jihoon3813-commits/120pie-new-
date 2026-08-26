import React from "react";

interface OfficialSealStampProps {
  size?: number;
  className?: string;
}

export const OfficialSealStamp: React.FC<OfficialSealStampProps> = ({ size = 76, className = "" }) => {
  return (
    <div 
      className={`inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      title="(주)고우웰라이프 직인"
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="transform -rotate-6 filter drop-shadow-xs"
      >
        {/* Outer Circle */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#DC2626"
          strokeWidth="3.5"
          strokeDasharray="98 2"
        />
        {/* Inner Circle */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1.2"
        />
        
        {/* Top Arc Text: (주)고우웰라이프 */}
        <path
          id="sealTopPath"
          d="M 18,50 A 32,32 0 0,1 82,50"
          fill="none"
        />
        <text
          fill="#DC2626"
          fontSize="10"
          fontWeight="900"
          letterSpacing="1.2"
          textAnchor="middle"
        >
          <textPath href="#sealTopPath" startOffset="50%">
            (주)고우웰라이프
          </textPath>
        </text>

        {/* Center Text: 대표이사 / 이사근 */}
        <g fill="#DC2626" textAnchor="middle">
          <text x="50" y="47" fontSize="10.5" fontWeight="900" letterSpacing="1">
            대표이사
          </text>
          <text x="50" y="63" fontSize="13.5" fontWeight="900" letterSpacing="2">
            이사근
          </text>
        </g>

        {/* Bottom Arc Text: 가맹사업본부 직인 */}
        <path
          id="sealBottomPath"
          d="M 82,50 A 32,32 0 0,1 18,50"
          fill="none"
        />
        <text
          fill="#DC2626"
          fontSize="8.5"
          fontWeight="800"
          letterSpacing="2"
          textAnchor="middle"
        >
          <textPath href="#sealBottomPath" startOffset="50%">
            직인
          </textPath>
        </text>
      </svg>
    </div>
  );
};
