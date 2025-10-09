import { Button } from "react-bootstrap";

function MyButton({ text, onClick, variant = "primary" }) {
  return (
    <Button variant={variant} onClick={onClick}>
      {text}
    </Button>
  );
}

export default MyButton;
