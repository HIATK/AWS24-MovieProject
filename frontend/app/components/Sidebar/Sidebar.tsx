'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CiMenuBurger } from 'react-icons/ci';
import { CgProfile } from 'react-icons/cg';
import {IoHomeOutline, IoStatsChartOutline} from 'react-icons/io5';
import { BiLink } from 'react-icons/bi';
import { RiHistoryLine } from 'react-icons/ri';
import { AiOutlineStar } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
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
import {VscSettings} from "react-icons/vsc";
import {MdLogin, MdLogout} from "react-icons/md";

interface MenuItem {
    icon: JSX.Element;
    text: string;
    href: string;
}

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // 로그인 상태를 저장할 상태

    useEffect(() => {
        // 컴포넌트가 마운트되면 사용자 정보를 가져오는 함수 호출
        fetchUserInfo();
    }, []);

    // 서버로부터 사용자 정보를 가져오는 함수
    const fetchUserInfo = () => {
        // AccessToken을 LocalStorage에서 가져오거나, 필요에 따라 적절한 방법으로 가져옵니다.
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            // 서버에 AccessToken을 요청하여 사용자 정보를 가져오는 API 호출
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
                return response.json(); // JSON 형태의 roles 배열을 받음
            })
            .then(data => {
                // 서버로부터 받은 roles 배열을 기반으로 로그인 상태를 결정합니다.
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

    const menuItems: MenuItem[] = [
        { icon: <CgProfile />, text: '프로필', href: '/member/profile' },
        { icon: <IoHomeOutline />, text: '홈으로', href: '/' },
        { icon: <IoStatsChartOutline />, text: '데이터사용량', href: '/data-usage' },
        { icon: <BiLink />, text: '내URL', href: '/my-url' },
    ];

    const settingsItem: MenuItem = { icon: <MdLogin />, text: '로그인', href: '/member/login' };
    const settingsItem2: MenuItem = { icon: <MdLogout />, text: '로그아웃', href: '/settings' };

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
                <MenuLink href={isLoggedIn ? settingsItem2.href : settingsItem.href}>
                    <Icon>{isLoggedIn ? settingsItem2.icon : settingsItem.icon}</Icon>
                    <MenuText isOpen={isOpen}>{isLoggedIn ? settingsItem2.text : settingsItem.text}</MenuText>
                </MenuLink>
                <HoverText isOpen={isOpen}>{isLoggedIn ? settingsItem2.text : settingsItem.text}</HoverText>
            </SettingsItemWrapper>
        </SidebarContainer>
    );
};

export default Sidebar;