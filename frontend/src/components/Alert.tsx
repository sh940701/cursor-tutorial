import React from 'react';
import { Alert as AlertType } from '../types';

interface AlertProps {
  message: string;
  type: AlertType['type'];
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  );
};

export default Alert; 