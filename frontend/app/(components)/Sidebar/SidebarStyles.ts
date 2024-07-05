// SidebarStyles.ts

import styled from 'styled-components';

interface StyledProps {
    isOpen: boolean;
}

export const SidebarContainer = styled.div<StyledProps>`
    position: fixed;
    top: 0;
    left: 0;
    width: ${({ isOpen }) => (isOpen ? '150px' : '60px')};
    height: 100vh;
    background-color: rgba(33, 33, 33, 0.87);
    color: #5fbebb;
    transition: width 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const MenuList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0px 0 0 0;
    display: flex;
    flex-direction: column;
`;

export const MenuItemWrapper = styled.li<StyledProps>`
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

export const SettingsItemWrapper = styled(MenuItemWrapper)<StyledProps>`
    margin-top: auto;
    margin-bottom: 20px;
`;

export const MenuLink = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
`;

export const Icon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
`;

export const MenuText = styled.div<StyledProps>`
    margin-left: 10px;
    white-space: nowrap;
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

export const HoverText = styled.div<StyledProps>`
    position: absolute;
    left: ${({ isOpen }) => (isOpen ? '60px' : '100%')};
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(33, 33, 33, 0.85);
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
        opacity: ${({ isOpen }) => (isOpen ? '0' : '1')};
        left: ${({ isOpen }) => (isOpen ? '60px' : 'calc(100% + 5px)')};
    }
`;
