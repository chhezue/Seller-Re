import React, { useState } from 'react';

function LoginPage() {
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userPassword }),
                credentials: 'include', // 쿠키를 포함시켜서 서버로 전송
            });

            const data = await response.json();
            if (data.accessToken) {
                // accessToken은 localStorage에 저장
                localStorage.setItem('accessToken', data.accessToken);

                // 로그인 후 메인 페이지로 리다이렉트
                window.location.href = '/';
            } else {
                alert('로그인 실패');
            }
        } catch (err) {
            console.error(err);
            alert('로그인 오류');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <input
                type="password"
                placeholder="User Password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
            />
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
}

export default LoginPage;
