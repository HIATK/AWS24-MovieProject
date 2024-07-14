'use client';

import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { IoHomeOutline, IoStatsChartOutline } from 'react-icons/io5';
import { BiLink } from 'react-icons/bi';
import { MdLogin, MdLogout } from 'react-icons/md';
import Link from 'next/link';
import { useAuth } from '../../(context)/AuthContext';
import {
    SidebarContainer,
    MenuList,
    MenuItemWrapper,
    MenuLink,
    Icon,
    MenuText,
    HoverText,
    SettingsItemWrapper,
    SearchBarWrapper,
    ThemeToggleWrapper
} from './SidebarStyles';
import ThemeToggle from "@/(components)/DarkModToggle/ThemeToggle";
import { useTheme } from '../DarkModToggle/ThemeContext';
import SearchBar from '@/(components)/SearchBar/SearchBar';
import { logout as logoutService } from '@/_Service/MemberService'; // 경로를 프로젝트 구조에 맞게 수정

interface MenuItem {
    icon: JSX.Element;
    text: string;
    href: string;
}

const SidebarClient: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const { theme } = useTheme();

    const menuItems: MenuItem[] = [
        { icon: <CgProfile size={24} />, text: '프로필', href: '/member/profile' },
        { icon: <IoHomeOutline size={24} />, text: '홈으로', href: '/' },
        { icon: <IoStatsChartOutline size={24} />, text: '데이터사용량', href: '/data-usage' },
        { icon: <BiLink size={24} />, text: '내URL', href: '/my-url' },
    ];

    const settingsItem: MenuItem = { icon: <MdLogin size={24} />, text: '로그인', href: '/member/login' };
    const settingsItem2: MenuItem = { icon: <MdLogout size={24} />, text: '로그아웃', href: '/member/logout' };

    const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        try {
            await logoutService();
            alert('로그아웃 되었습니다');
            logout();
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <SidebarContainer $isOpen={isOpen} $theme={theme} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <MenuList>
                <SearchBarWrapper>
                    <SearchBar underlineColor={theme === 'light' ? '#333333' : '#5fbebb'} />
                </SearchBarWrapper>
                {menuItems.map((item, index) => (
                    <MenuItemWrapper key={index} $isOpen={isOpen} $theme={theme}>
                        <Link href={item.href}>
                            <MenuLink>
                                <Icon $theme={theme}>{item.icon}</Icon>
                                <MenuText $isOpen={isOpen} $theme={theme}>{item.text}</MenuText>
                            </MenuLink>
                        </Link>
                        <HoverText $isOpen={isOpen} $theme={theme}>{item.text}</HoverText>
                    </MenuItemWrapper>
                ))}
            </MenuList>
            <ThemeToggleWrapper $isOpen={isOpen} $theme={theme}>
                <ThemeToggle />
                <MenuText $isOpen={isOpen} $theme={theme}>테마 변경</MenuText>
                <HoverText $isOpen={isOpen} $theme={theme}>
                    {theme === 'light' ? '다크모드로 변경' : '라이트모드로 변경'}
                </HoverText>
            </ThemeToggleWrapper>
            <SettingsItemWrapper $isOpen={isOpen} $theme={theme}>
                {isLoggedIn ? (
                    <Link href="/logout" onClick={handleLogout}>
                        <MenuLink>
                            <Icon $theme={theme}>{settingsItem2.icon}</Icon>
                            <MenuText $isOpen={isOpen} $theme={theme}>{settingsItem2.text}</MenuText>
                        </MenuLink>
                    </Link>
                ) : (
                    <Link href={settingsItem.href}>
                        <MenuLink>
                            <Icon $theme={theme}>{settingsItem.icon}</Icon>
                            <MenuText $isOpen={isOpen} $theme={theme}>{settingsItem.text}</MenuText>
                        </MenuLink>
                    </Link>
                )}
                <HoverText $isOpen={isOpen} $theme={theme}>{isLoggedIn ? settingsItem2.text : settingsItem.text}</HoverText>
            </SettingsItemWrapper>
        </SidebarContainer>
    );
};

export default SidebarClient;
