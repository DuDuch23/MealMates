import { useState } from 'react';
export default function iconUser(){
    const [icon, setIcon] = useState([
        {id:1,img:
            ( 
            <svg width="200" height="210" viewBox="0 0 200 210" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_387_407)">
                    <g clip-path="url(#clip0_387_407)">
                        <path d="M148.333 106.333C153.741 88.3727 157.075 57.6667 134.333 36.6667C116.953 20.6173 69.9999 19 53.6666 54C50.9399 59.8427 54.6666 69 61.9999 68.6667C64.8819 68.5333 66.6666 77.6667 68.3333 83.3333C65.9999 106.333 45.2119 106.758 34.6666 124.333C21.6666 146 37.6666 178 75.9999 178C114.333 178 136.308 146.27 148.333 106.333Z" fill="url(#paint0_linear_387_407)"/>
                        <path d="M161.333 158.667C166.222 168 168.666 202 168.666 202H31.333C31.333 202 33.7777 168 38.6663 158.667C45.9997 144.667 99.9997 126.667 99.9997 126.667C99.9997 126.667 154 144.667 161.333 158.667Z" fill="url(#paint1_linear_387_407)"/>
                        <path d="M116 134.667C116 134.667 107.489 139.333 99.6595 139.333C91.8302 139.333 83.9995 134.667 83.9995 134.667V120C82.3152 120.266 80.6089 120.368 78.9049 120.303C62.9129 120.301 56.8829 97.0073 59.9995 68.6666C61.9995 68.6666 66.6662 68.6666 73.3329 59.3333C71.6662 72.3333 90.9995 70.3333 98.3329 60C94.6662 72.3333 104.333 80.6666 112.666 75.6666C129.007 65.862 132.68 95.7506 116 96V134.667Z" fill="url(#paint2_linear_387_407)"/>
                        <path d="M84 120C92.2699 118.477 100.183 115.425 107.333 111C107.333 111 99 125.333 84 125.333V120Z" fill="#FFB597"/>
                        <path d="M100.022 138.65C104.84 138.432 116 136.072 116 130.973V126.667C117.223 126.667 120.724 129.555 122.524 132C129.642 141.667 121.747 150.333 115.308 150.333C107.184 150.333 101.8 143.545 100 140.28C98.2002 143.547 92.8162 150.333 84.6922 150.333C78.2536 150.333 70.3589 141.667 77.4762 132C79.2769 129.555 82.7776 126.667 84.0002 126.667V130.973C84.0002 136.072 95.4616 138.432 100.022 138.65Z" fill="white"/>
                    </g>
                </g>
                <defs>
                    <filter id="filter0_d_387_407" x="-10" y="-10" width="220" height="220" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="5"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_387_407"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_387_407" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_387_407" x1="91.2547" y1="178" x2="91.2547" y2="25.7256" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E6864E"/>
                        <stop offset="1" stop-color="#E67240"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_387_407" x1="99.9997" y1="202" x2="99.9997" y2="126.667" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFC9B3"/>
                        <stop offset="1" stop-color="#FFD2C2"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_387_407" x1="93.0306" y1="59.3333" x2="93.0306" y2="139.333" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFD4B3"/>
                        <stop offset="1" stop-color="#FFDCC2"/>
                    </linearGradient>
                    <clipPath id="clip0_387_407">
                        <rect width="200" height="200" rx="100" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
            )},
        {id:2,img:
            (
            <svg width="200" height="210" viewBox="0 0 200 210" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_387_400)">
                    <g clip-path="url(#clip0_387_400)">
                        <path d="M82.1946 139.249C87.9682 129.649 101.224 111.248 132.786 85.3919C180.413 46.3753 135.462 10.6881 87.1731 29.695C82.0074 31.7285 67.6926 23.5879 54.4326 32.1641C45.8788 37.6964 49.2077 42.032 45.8771 46.3676C42.5465 50.7033 29.7059 50.4481 26.8929 61.7061C25.2269 68.3759 29.8372 75.3623 29.2206 80.3825C28.6039 85.4027 23.737 89.928 23.5048 96.5553C23.4043 99.3545 23.8562 102.146 24.8347 104.77C25.8132 107.395 27.2991 109.801 29.2076 111.851C31.1161 113.901 33.4098 115.555 35.9577 116.719C38.5055 117.882 41.2576 118.532 44.0568 118.632C44.0797 124.166 46.2404 129.477 50.0874 133.455C53.9344 137.432 59.1699 139.77 64.6998 139.977C68.2457 140.107 71.7674 139.344 74.9418 137.759C78.0915 140.662 80.7955 141.575 82.1946 139.249Z" fill="url(#paint0_linear_387_400)"/>
                        <path d="M83.3333 129.333C83.3333 123.333 83.1293 93.7386 83.1393 93.2386C66.6666 95.6666 67 64.3333 83.6666 72C87.3333 74.3333 97.6666 72 96.6666 52.6666C114.667 72 135.565 49.4506 137.357 67.8253C139.804 92.9153 137.342 119.173 121.749 119.175C120.044 119.154 118.343 118.984 116.667 118.667V129.333C116.667 136 128.667 139.333 128.667 139.333C128.667 139.333 107.939 158.867 99.3333 158.759C90.728 158.651 71.3333 139.333 71.3333 139.333C71.3333 139.333 83.3333 136 83.3333 129.333Z" fill="url(#paint1_linear_387_400)"/>
                        <path style="mix-blend-mode:multiply" opacity="0.7" d="M116.666 118.663C108.396 116.829 100.558 113.411 93.5869 108.597C93.5869 108.597 99.339 122.659 116.645 125.327L116.666 118.663Z" fill="url(#paint2_linear_387_400)"/>
                        <path d="M161.333 159.333C166.17 170.081 168.666 202.667 168.666 202.667H31.333C31.333 202.667 33.8297 170.081 38.6663 159.333C42.9037 149.918 70.8257 139.107 79.0083 136C83.733 141.285 90.5037 144.667 99.9997 144.667C109.496 144.667 116.266 141.285 120.991 136C129.174 139.107 157.096 149.918 161.333 159.333Z" fill="url(#paint3_linear_387_400)"/>
                        <path d="M37.3831 159.55C41.0111 152.651 52.9518 145.412 63.9931 140.533C69.4998 138.099 85.9998 208 85.9998 208H30.7218C30.7218 208 30.0558 173.484 37.3831 159.55Z" fill="url(#paint4_linear_387_400)"/>
                    </g>
                </g>
                <defs>
                    <filter id="filter0_d_387_400" x="-10" y="-10" width="220" height="220" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="5"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_387_400"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_387_400" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_387_400" x1="90.0769" y1="23.5607" x2="85.9703" y2="140.777" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#1D0024"/>
                        <stop offset="1" stop-color="#100014"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_387_400" x1="104.573" y1="52.6666" x2="104.573" y2="158.759" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E6864E"/>
                        <stop offset="1" stop-color="#EB965E"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_387_400" x1="97.9454" y1="111.743" x2="101.404" y2="127.3" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E68349"/>
                        <stop offset="1" stop-color="#F09960"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_387_400" x1="99.9997" y1="202.667" x2="99.9997" y2="136" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFC9B3"/>
                        <stop offset="1" stop-color="#FFD2C2"/>
                    </linearGradient>
                    <linearGradient id="paint4_linear_387_400" x1="58.3529" y1="208" x2="58.3529" y2="140.471" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FCF2EB"/>
                        <stop offset="1" stop-color="#FFF9F5"/>
                    </linearGradient>
                    <clipPath id="clip0_387_400">
                        <rect width="200" height="200" rx="100" fill="white"/>
                        </clipPath>
                </defs>
            </svg>
            )},
        ]);
}