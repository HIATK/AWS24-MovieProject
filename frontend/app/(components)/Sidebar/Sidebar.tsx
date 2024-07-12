'use client';

import React, { useState, useEffect } from 'react';
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
  SettingsItemWrapper
} from './SidebarStyles';
import SearchBar from "@/(components)/SearchBar/SearchBar";
import ThemeToggle from "@/(components)/DarkModToggle/ThemeToggle";

interface MenuItem {
  icon: JSX.Element;
  text: string;
  href: string;
}

const SidebarClient: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const menuItems: MenuItem[] = [
    { icon: <CgProfile />, text: '프로필', href: '/member/profile' },
    { icon: <IoHomeOutline />, text: '홈으로', href: '/' },
    { icon: <IoStatsChartOutline />, text: '데이터사용량', href: '/data-usage' },
    { icon: <BiLink />, text: '내URL', href: '/my-url' },

  ];

  const settingsItem: MenuItem = { icon: <MdLogin />, text: '로그인', href: '/member/login' };
  const settingsItem2: MenuItem = { icon: <MdLogout />, text: '로그아웃', href: '/member/logout' };

  const handleLogout = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/member/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
      });

      if (response.ok) {
        alert('로그아웃 되었습니다');
        logout();
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <SidebarContainer $isOpen={isOpen} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <MenuList>
        {menuItems.map((item, index) => (
          <MenuItemWrapper key={index} $isOpen={isOpen}>

            <Link href={item.href}>
              <MenuLink>
                <Icon>{item.icon}</Icon>
                <MenuText $isOpen={isOpen}>{item.text}</MenuText>
              </MenuLink>
            </Link>
            <HoverText $isOpen={isOpen}>{item.text}</HoverText>
          </MenuItemWrapper>
        ))}

      </MenuList>
      <SettingsItemWrapper $isOpen={isOpen}>
        {isLoggedIn ? (
          <Link href="/logout" onClick={handleLogout}>
            <MenuLink>
              <Icon>{settingsItem2.icon}</Icon>
              <MenuText $isOpen={isOpen}>{settingsItem2.text}</MenuText>
            </MenuLink>
          </Link>
        ) : (
          <Link href={settingsItem.href}>
            <MenuLink>
              <Icon>{settingsItem.icon}</Icon>
              <MenuText $isOpen={isOpen}>{settingsItem.text}</MenuText>
            </MenuLink>
          </Link>

        )}
        <HoverText $isOpen={isOpen}>{isLoggedIn ? settingsItem2.text : settingsItem.text}</HoverText>

      </SettingsItemWrapper>
    </SidebarContainer>
  );
};

export default SidebarClient;
