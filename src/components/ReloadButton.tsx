/**Reload button thhat is triggered when clicked on the pop up modal
 * Shown in the error modal when users are on unsupported network
 */

import React from 'react';

interface ReloadButtonProps {
  onReload: () => void;
}

const ReloadButton: React.FC<ReloadButtonProps> = ({ onReload }) => {
  return (
    <button
      onClick={onReload}
      className="reload-button"
    >
      Reload
    </button>
  );
};

export default ReloadButton;