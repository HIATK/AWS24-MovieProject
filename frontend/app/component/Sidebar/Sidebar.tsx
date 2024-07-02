'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { CiMenuBurger } from 'react-icons/ci';
import { CgProfile } from 'react-icons/cg';
import { IoStatsChartOutline } from 'react-icons/io5';
import { BiLink } from 'react-icons/bi';
import { RiHistoryLine } from 'react-icons/ri';
import { AiOutlineStar } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';

interface StyledProps {
    isOpen: boolean;
}

const SidebarContainer = styled.div<StyledProps>`
    position: fixed;
    top: 0;
    left: 0;
    width: ${({isOpen}) => (isOpen ? '200px' : '60px')};
    height: 100vh;
    background-color: rgba(33, 33, 33, 0.87);
    color: #5fbebb;
    transition: width 0.3s ease;
    z-index: 1000;
`;
const MenuToggle = styled.div`
    position: absolute;
    top: 10px;
    left: 18px;
    cursor: pointer;
    z-index: 1100;
`;

const MenuList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 40px 0 0 0;
    display: flex;
    flex-direction: column;
`;

const MenuItemWrapper = styled.li<StyledProps>`
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 18px;
    cursor: pointer;
    position: relative;

    &:hover {
        background-color: ${({ isOpen }) => (isOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
    }
`;

const MenuLink = styled(Link)`
    display: flex;
    align-items: center;
    width: 100%;
    color: inherit;
    text-decoration: none;
`;

const Icon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
`;

const MenuText = styled.div<StyledProps>`
    margin-left: 10px;
    white-space: nowrap;
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const HoverText = styled.div<StyledProps>`
    position: absolute;
    left: ${({isOpen}) => (isOpen ? '60px' : '100%')};
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(33, 33, 33, 0.8);
    color: #5fbebb;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease, left 0.3s ease;
    pointer-events: none;
    z-index: 1200;

    ${MenuItemWrapper}:hover & {
        opacity: ${({isOpen}) => (isOpen ? '0' : '1')};
        left: ${({isOpen}) => (isOpen ? '60px' : 'calc(100% + 5px)')};
    }
`;

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { icon: <CgProfile />, text: '프로필', href: '/profile' },
        { icon: <IoStatsChartOutline />, text: '데이터사용량', href: '/data-usage' },
        { icon: <BiLink />, text: '내URL', href: '/my-url' },
        { icon: <RiHistoryLine />, text: '구매내역', href: '/purchase-history' },
        { icon: <AiOutlineStar />, text: '추천목록', href: '/recommendations' },
        { icon: <IoSettingsOutline />, text: '설정', href: '/settings' },
    ];

    return (
        <SidebarContainer isOpen={isOpen}>
            <MenuToggle onClick={toggleSidebar}>
                <CiMenuBurger />
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
        </SidebarContainer>
    );
};

export default Sidebar;