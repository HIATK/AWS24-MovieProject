'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CgProfile } from 'react-icons/cg';
import { IoHomeOutline, IoStatsChartOutline } from 'react-icons/io5';
import { BiLink } from 'react-icons/bi';
import { MdLogin, MdLogout } from 'react-icons/md';
import {
    SidebarContainer,
    MenuToggle,
    MenuList,
    MenuItemWrapper,
    MenuLink,
    Icon,
    MenuText,
    HoverText,
    SettingsItemWrapper
} from './SidebarStyles';
import { VscSettings } from 'react-icons/vsc';

interface MenuItem {
    icon: JSX.Element;
    text: string;
    href: string;
}

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        fetchUserInfo();
    }, [pathname]);

    const fetchUserInfo = () => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            fetch('/api/check_auth', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user info');
                }
                return response.json();
            })
            .then(data => {
                setIsLoggedIn(data.includes('GUEST'));
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
            });
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault(); // 기본 이벤트(페이지 이동) 막기
        
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setIsLoggedIn(false); // 로그아웃 상태로 설정

                alert('로그아웃 되었습니다');
            } else {
                throw new Error('로그아웃 실패');
            }
        } catch (error) {
            console.error('로그아웃 에러:', error);
        }
    };

    const menuItems: MenuItem[] = [
        { icon: <CgProfile />, text: '프로필', href: '/member/profile' },
        { icon: <IoHomeOutline />, text: '홈으로', href: '/' },
        { icon: <IoStatsChartOutline />, text: '데이터사용량', href: '/data-usage' },
        { icon: <BiLink />, text: '내URL', href: '/my-url' },
    ];

    const settingsItem: MenuItem = { icon: <MdLogin />, text: '로그인', href: '/member/login' };
    const settingsItem2: MenuItem = { icon: <MdLogout />, text: '로그아웃', href: '/member/logout' };

    return (
        <SidebarContainer isOpen={isOpen}>
            <MenuToggle onClick={toggleSidebar}>
                <VscSettings />
            </MenuToggle>
            <MenuList>
                {menuItems.map((item, index) => (
                    <MenuItemWrapper key={index} isOpen={isOpen}>
                        <MenuLink href={item.href}>
                            <Icon>{item.icon}</Icon>
                            <MenuText isOpen={isOpen}>{item.text}</MenuText>
                        </MenuLink>
                        <HoverText isOpen={isOpen}>{item.text}</HoverText>
                    </MenuItemWrapper>
                ))}
            </MenuList>
            <SettingsItemWrapper isOpen={isOpen}>
                {isLoggedIn ? (
                    <Link href={settingsItem2.href} onClick={handleLogout}>
                        <Icon>{settingsItem2.icon}</Icon>
                        <MenuText isOpen={isOpen}>{settingsItem2.text}</MenuText>
                    </Link>
                ) : (
                    <Link href={settingsItem.href}>            
                        <Icon>{settingsItem.icon}</Icon>
                        <MenuText isOpen={isOpen}>{settingsItem.text}</MenuText>                      
                    </Link>
                )}
                <HoverText isOpen={isOpen}>{isLoggedIn ? settingsItem2.text : settingsItem.text}</HoverText>
            </SettingsItemWrapper>
        </SidebarContainer>
    );
};

export default Sidebar;
