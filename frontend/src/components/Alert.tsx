import { ReactNode, useState } from "react";

interface AlertProps {
  children?: ReactNode;
  alertType: 0 | 1 | 2 | 3 | 4; // number from 0 - 4 in order are blue, gray, green, red, yellow
}

const Alert = ({ children, alertType }: AlertProps) => {
  // Open state
  const [isOpen, setIsOpen] = useState(true);

  // Colors list for the alert
  const colorsList = [
    "alert-primary",
    "alert-secondary",
    "alert-success",
    "alert-danger",
    "alert-warning",
  ];

  // Create className for alert
  const className: string = `alert ${colorsList[alertType]} alert-dismissible custom-alert-box`;

  // Handle close button click
  const handleCloseClick = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="alert-container">
      <div className={className} role="alert">
        {children}
        <button
          type="button"
          className="btn-close"
          onClick={handleCloseClick}
        ></button>
      </div>
    </div>
  );
};

export default Alert;
