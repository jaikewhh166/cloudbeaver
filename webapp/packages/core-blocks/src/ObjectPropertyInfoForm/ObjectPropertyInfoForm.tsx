/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import { useCallback } from 'react';
import styled from 'reshadow';

import { InputField } from '@cloudbeaver/core-blocks';
import { ObjectPropertyInfo } from '@cloudbeaver/core-sdk';
import { useStyles } from '@cloudbeaver/core-theming';

import { TextPlaceholder } from '../TextPlaceholder';
import { formStyles } from './formStyles';

interface Props {
  properties: ObjectPropertyInfo[] | undefined;
  credentials: Record<string, string | number>;
  disabled?: boolean;
  autofillToken?: string;
  className?: string;
  onFocus?: (name: string) => void;
}

const RESERVED_KEYWORDS = ['no', 'off', 'new-password'];

export const ObjectPropertyInfoForm: React.FC<Props> = observer(function ObjectPropertyInfoForm({
  properties,
  credentials,
  disabled,
  autofillToken = '',
  className,
  onFocus,
}) {
  const style = useStyles(formStyles);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(e.target.name);
    }
    if (e.target.type !== 'password') {
      return;
    }

    const property = properties?.find(property => property.id === e.target.name);

    if (property?.value === e.target.value) {
      credentials[e.target.name] = '';
    }
  }, [properties, credentials, onFocus]);

  if (!properties || properties.length === 0) {
    return <TextPlaceholder>Properties empty</TextPlaceholder>;
  }

  return styled(style)(
    <form-body as='div' className={className}>
      {properties.map(property => (
        <group key={property.id} as="div">
          <InputField
            type={property.features.includes('password') ? 'password' : 'text'}
            name={property.id!}
            state={credentials}
            disabled={disabled}
            autoComplete={RESERVED_KEYWORDS.includes(autofillToken) ? autofillToken : `${autofillToken} ${property.id}`}
            mod='surface'
            onFocus={handleFocus}
          >
            {property.displayName}
          </InputField>
        </group>
      ))}
    </form-body>
  );
});
