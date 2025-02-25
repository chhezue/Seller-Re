import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [region, setRegion] = useState("");
    const [profileImage, setProfileImage] = useState("/profileImg-default.png");
    const [products, setProducts] = useState([]);

    const convertGoogleDriveUrl = (url) => {
        if (!url) return "/no-img.png";  // 파일 없으면 기본 이미지
        const match = url.match(/id=([^&]+)/);
        return match ? `https://lh3.google.com/u/0/d/${match[1]}` : url;
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser); // JSON 변환
                setUsername(parsedUser.username);
                setRegion(parsedUser.region);
                setProfileImage(parsedUser.profileImage || "/profileImg-default.png");
                getSales();
            } catch (error) {
                console.error("JSON 파싱 오류:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const getSales = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:9000/api/products/mySales", {
                headers: { Authorization: `Bearer ${accessToken}`,}
            })
            if (!response.ok) throw new Error("판매 상품을 불러오는 데 실패했습니다.");
            const sales = await response.json();
            setProducts(sales);
        } catch (error) {
            console.error("판매 상품 조회 오류:", error);
        }
    }

    const handleClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="flex items-center space-x-4 border-b pb-4">
                <img src={profileImage} alt="프로필이미지" className="w-16 h-16 rounded-full object-cover"/>
                <div>
                    <p className="text-lg font-bold">{username}</p>
                    <span className="text-gray-500">{region}</span>
                </div>
            </div>

            <div className="flex mt-6 space-x-6">
                <div className="w-1/4 flex flex-col items-start">
                    <p className="text-lg font-semibold mb-2">판매 내역</p>
                    {products.length > 6 && <button className="text-blue-600 hover:underline">더보기</button>}
                </div>

                <div className="w-3/4 space-y-4">
                    {products.length === 0 ? (
                        <p className="text-center text-gray-500">판매 상품이 없습니다.</p>
                    ) : (
                        <ul className="space-y-4">
                            {products.map((product) => (
                                <li key={product._id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
                                    <div className="flex items-center cursor-pointer"
                                         onClick={() => handleClick(product._id)}>
                                        <img src={convertGoogleDriveUrl(product.fileNames?.[0])} alt="상품이미지" className="w-24 h-24 rounded-md object-cover"/>
                                        <div className="ml-4 flex-1">
                                            <p className="text-gray-700 font-medium">{product.name}</p>
                                            <p className="text-xl leading-10 font-bold">
                                                {product.transactionType === "판매" ? `${product.price} 원` : "무료 나눔"}
                                            </p>
                                            <p className="text-sm text-gray-500">{product.createdAt}</p>
                                        </div>
                                    </div>
                                    <button
                                        className="px-4 py-2 text-white font-bold rounded-lg bg-gray-700 hover:bg-gray-800">
                                    {product.status === '판매중' ? '요청 보기' : '거래 완료'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}