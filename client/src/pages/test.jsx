// src/test.jsx
import React, { useState, useEffect } from "react";

const Test = () => {
    const [message, setMessage] = useState("");

    // Express와 통신
    useEffect(() => {
        fetch("http://localhost:9000/api/test") // Express 서버의 엔드포인트
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message); // 서버에서 받은 메시지 저장
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>React와 Express 통신</h1>
            <p>{message || "Loading..."}</p>
        </div>
    );
};

export default Test;
