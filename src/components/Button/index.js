import "../Button/Button.css";

const Button = ({ content, onButtonClick, types }) => {
  return (
    <>
      <div className={`Button ${content === "0" ? "zero" : ""} ${types || ""}`} onClick={onButtonClick(content)}>
        {content}
      </div>
    </>
  );
};

export default Button;
