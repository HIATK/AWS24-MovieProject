import React from 'react';

const Navigation: React.FC = () => {
    return (
        <div className="menu">
            <label htmlFor="expand-menu"><div>메뉴</div></label>
            <input type="checkbox" id="expand-menu" name="expand-menu" />
            <ul>
                <li><a href="#" className="item"><div>프로필</div></a></li>
                <li><a href="#" className="item"><div>데이터사용량</div></a></li>
                <li><a href="#" className="item"><div>내URL</div></a></li>
                <li><a href="#" className="item"><div>구매내역</div></a></li>
                <li><a href="#" className="item"><div>추천목록</div></a></li>
                <li><a href="#" className="item"><div>설정</div></a></li>
            </ul>
        </div>
    );
}

export default Navigation;