'use client';

import React, { useState } from 'react';
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

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { icon: <CgProfile />, text: '프로필', href: '/member/profile' },
        { icon: <IoHomeOutline />, text: '홈으로', href: '/' },
        { icon: <IoStatsChartOutline />, text: '데이터사용량', href: '/data-usage' },
        { icon: <BiLink />, text: '내URL', href: '/my-url' },
    ];

    // eslint-disable-next-line react/jsx-no-undef
    //로그인
    const settingsItem = { icon: <MdLogin />, text: '로그인', href: '/member/login' };
    //로그아웃
    const settingsItem2 = { icon: <MdLogout />, text: '로그아웃', href: '/settings' };

    return (
        <SidebarContainer isOpen={isOpen}>
            <MenuToggle onClick={toggleSidebar}>
                {/* eslint-disable-next-line react/jsx-no-undef */}
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
                <MenuLink href={settingsItem.href}>
                    <Icon>{settingsItem.icon}</Icon>
                    <MenuText isOpen={isOpen}>{settingsItem.text}</MenuText>
                </MenuLink>
                <HoverText isOpen={isOpen}>{settingsItem.text}</HoverText>
            </SettingsItemWrapper>
        </SidebarContainer>
    );
};

export default Sidebar;