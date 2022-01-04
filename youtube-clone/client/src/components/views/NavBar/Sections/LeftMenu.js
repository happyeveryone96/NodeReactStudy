import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="a">
      <a href="/">Home</a>
    </Menu.Item>
    <Menu.Item key="b">
      <a href="/subscription">Subscription</a>
    </Menu.Item>
  </Menu>
  )
}

export default LeftMenu