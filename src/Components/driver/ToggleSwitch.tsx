import { FC } from "react";
import styled from "styled-components";

interface CheckBox {
  isChecked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: FC<CheckBox> = ({ isChecked, onChange }) => {
  return (
    <StyledWrapper>
      <div className="toggle-button-cover">
        <div id="button-3" className="button r">
          <input
            className="checkbox"
            type="checkbox"
            checked={isChecked} // Directly use isChecked without negation
            onChange={onChange}
          />
          <div className="knobs" />
          <div className="layer" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .toggle-button-cover {
    display: table-cell;
    position: relative;
    width: 200px;
    height: 140px;
    box-sizing: border-box;
    z-index: 10;
  }

  .button-cover {
    height: 100px;
    margin: 20px;
    background-color: #fff;
    box-shadow: 0 10px 20px -8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .button-cover:before {
    counter-increment: button-counter;
    content: counter(button-counter);
    position: absolute;
    right: 0;
    bottom: 0;
    color: #d7e3e3;
    font-size: 12px;
    line-height: 1;
    padding: 5px;
  }

  .button-cover,
  .knobs,
  .layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .button {
    position: relative;
    top: 50%;
    width: 74px;
    height: 36px;
    margin: -20px auto 0 auto;
    overflow: hidden;
  }

  .checkbox {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
  }

  .knobs {
    z-index: 2;
  }

  .layer {
    width: 100%;
    background-color: #f0f0f0;
    transition: 0.3s ease all;
    z-index: 1;
  }

  .button.r,
  .button.r .layer {
    border-radius: 100px;
  }

  #button-3 .knobs:before {
    content: "NO";
    position: absolute;
    top: 50%;
    left: 4px;
    width: 28px;
    height: 28px;
    color: #fff;
    font-size: 10px;
    font-weight: bold;
    text-align: center;
    line-height: 28px;
    background-color: #f44336;
    border-radius: 50%;
    transform: translateY(-50%);
    transition: 0.3s ease all, left 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15);
  }

  #button-3 .checkbox:checked + .knobs:before {
    content: "YES";
    left: calc(100% - 32px);
    background-color: #60eb91;
  }

  #button-3 .checkbox:checked ~ .layer {
    background-color: #e8f5e9;
  }
`;

export default ToggleSwitch;
