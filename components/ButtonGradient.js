"use client";

import ShineButton from "./ui/ShineButton";

const ButtonGradient = ({ title = "Gradient Button", onClick = () => {} }) => {
  return (
    <ShineButton 
      className="gradient-blue glow-primary" 
      onClick={onClick}
      variant="default"
    >
      {title}
    </ShineButton>
  );
};

export default ButtonGradient;
