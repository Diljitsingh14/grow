import React from "react";

interface FacebookLoginButtonProps {
  onClick: () => void;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 mr-2"
      >
        <path
          fillRule="evenodd"
          d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24H12.82V14.709h-3.368v-3.602h3.368V8.408c0-3.338 2.019-5.156 4.966-5.156 1.413 0 2.627.105 2.977.152v3.452l-2.043.001c-1.601 0-1.91.76-1.91 1.875v2.457h3.816l-.498 3.602h-3.318V24h6.495C23.407 24 24 23.406 24 22.675V1.325C24 .593 23.407 0 22.675 0z"
          clipRule="evenodd"
        />
      </svg>
      Continue with Facebook
    </button>
  );
};

export default FacebookLoginButton;
