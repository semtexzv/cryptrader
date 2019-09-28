import React from 'react';
import { setLinkProps } from 'hookrouter';
import HeaderMenuItem from "carbon-components-react/lib/components/UIShell/HeaderMenuItem";

export const LinkHeaderMenuItem = (props) => {
    return (<HeaderMenuItem {...setLinkProps(props)}>{props.children}</HeaderMenuItem>)
};