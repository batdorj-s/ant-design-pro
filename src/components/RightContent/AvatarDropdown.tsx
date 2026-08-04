import {
  LogoutOutlined,
  SettingOutlined,
  SkinOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Spin } from 'antd';
import { createStyles } from 'antd-style';
import React, { startTransition } from 'react';
import { outLogin } from '@/services/ant-design-pro/api';
import HeaderDropdown from '../HeaderDropdown';

const useStyles = createStyles(({ token, css }) => ({
  menu: css`
    overflow: hidden;
    border-radius: ${token.borderRadiusLG}px;
    background: ${token.colorBgElevated};
    box-shadow: ${token.boxShadowSecondary};
    .ant-dropdown-menu {
      box-shadow: none;
    }
  `,
  header: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-bottom: 1px solid ${token.colorSplit};
  `,
  logo: css`
    width: 44px;
    height: auto;
  `,
  info: css`
    display: flex;
    flex-direction: column;
    min-width: 0;
  `,
  name: css`
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    color: ${token.colorText};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  email: css`
    font-size: 12px;
    line-height: 1.4;
    color: ${token.colorTextSecondary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
}));

type GlobalHeaderRightProps = {
  children?: React.ReactNode;
};

const menuItems: MenuProps['items'] = [
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: '个人设置',
  },
  {
    key: 'theme',
    icon: <SkinOutlined />,
    label: '主题设置',
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];

const loginOut = async () => {
  try {
    await outLogin();
  } catch {
    // Local logout has already cleared user state; redirect should still proceed.
  }
  const { search, pathname } = window.location;
  const urlParams = new URL(window.location.href).searchParams;
  const searchParams = new URLSearchParams({
    redirect: pathname + search,
  });
  const redirect = urlParams.get('redirect');
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: searchParams.toString(),
    });
  }
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  children,
}) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();

  const onMenuClick: MenuProps['onClick'] = (event) => {
    const { key } = event;
    if (key === 'logout') {
      startTransition(() => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
      });
      loginOut();
      return;
    }
    if (key === 'theme') {
      setInitialState((s) => ({ ...s, settingDrawerOpen: true }));
      return;
    }
    history.push(`/account/${key}`);
  };

  if (!initialState) {
    return <Spin size="small" />;
  }

  const { currentUser } = initialState;

  if (!currentUser) {
    return <Spin size="small" />;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
      dropdownRender={(menu) => (
        <div className={styles.menu}>
          <div className={styles.header}>
            <img className={styles.logo} src="/logo.svg" alt="logo" />
            <div className={styles.info}>
              <span className={styles.name}>{currentUser?.name}</span>
              {currentUser?.email && (
                <span className={styles.email}>{currentUser.email}</span>
              )}
            </div>
          </div>
          {menu}
        </div>
      )}
      arrow
    >
      {children}
    </HeaderDropdown>
  );
};
