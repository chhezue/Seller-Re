import React, {useState} from 'react';

function LoginPage() {
    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const handleLogin = async () => {
        console.log("로그인 버튼 클릭됨!"); // ✅ 실행 여부 확인

        try {
            const response = await fetch('http://localhost:9000/api/users/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId, userPassword}),
                credentials: 'include',
            });

            console.log("로그인 응답 상태:", response.status); // ✅ 응답 상태 확인

            const data = await response.json();
            console.log("로그인 응답 데이터:", data); // ✅ 응답 데이터 확인

            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                window.location.href = '/';
            } else {
                alert('로그인 실패');
            }
        } catch (err) {
            console.error("로그인 오류:", err);
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
